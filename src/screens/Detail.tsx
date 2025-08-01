import React, {useCallback, useLayoutEffect, useState} from 'react';
import {useData, useTheme, useTranslation} from '../hooks/';
import {Block, Button, Image, Input, Product, Text, Spinner} from '../components/';
import {ScrollView, TouchableOpacity, Image as RNImage} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type Photo = {
  uri: string;
  timestamp: string;
};

type PhotoSet = {
  id: string;
  photos: [Photo | null, Photo | null]; // fixed length of 2
  analysis?: {
    result: string;
    timestamp: string;
  };
  locked: boolean;
};

const Detail = ({navigation}) => {
  const {t} = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const {following, trending} = useData();
  const [products, setProducts] = useState(following);
  const {assets, colors, fonts, gradients, sizes, icons} = useTheme();

  {
    /* state management */
  }
  const [photoSets, setPhotoSets] = useState<PhotoSet[]>([
    {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      photos: [null, null],
      locked: false,
    },
  ]);
  const [currentPhotos, setCurrentPhotos] = useState<Photo[]>([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  // ensure we always have one editable photo set at the bottom
  const getLatestSet = (): PhotoSet => {
    if (photoSets.length === 0 || photoSets[0].locked) {
      const newSet: PhotoSet = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        photos: [null, null],
        locked: false,
      };
      setPhotoSets((prev) => [newSet, ...prev]);
      return newSet;
    }
    return photoSets[0];
  };

  const handlePhotoPick = async (index: 0 | 1) => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      alert('需要相机权限');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      base64: false,
    });

    if (!result.canceled && result.assets?.length) {
      const uri = result.assets[0].uri;
      const timestamp = new Date().toLocaleString();

      setPhotoSets((prev) => {
        const currentSet = prev.find((set) => !set.locked);
        if (!currentSet) return prev;

        // Update photo in the current editable set
        const updatedPhotos: [Photo | null, Photo | null] = [
          ...currentSet.photos,
        ];
        updatedPhotos[index] = {uri, timestamp};

        const updatedSet: PhotoSet = {
          ...currentSet,
          photos: updatedPhotos,
        };

        // Check if both photos are now filled
        const isComplete = updatedPhotos[0] && updatedPhotos[1];

        if (isComplete) {
          // Simulate backend analysis after 1s
          setIsWaiting(true);
          setIsAnalyzed (false);
          setTimeout(() => {

            const analyzedSet: PhotoSet = {
              ...updatedSet,
              locked: true,
              analysis: {
                result: '照片验证：图像通过 ✅',
                timestamp: new Date().toLocaleString(),
              },
            };

            const newEmptySet: PhotoSet = {
              id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              photos: [null, null],
              locked: false,
            };

            // Replace current set with analyzed one and add new empty set
            setPhotoSets((prevNow) => {
              const withoutCurrent = prevNow.filter(
                (s) => s.id !== currentSet.id,
              );
              return [...withoutCurrent, analyzedSet, newEmptySet];
            });
             setIsWaiting(false);
             setTimeout(() => {
                 setIsAnalyzed(true)
             },15000);
          }, 7000);

        }

        // Immediate update with one photo filled
        return prev.map((set) => (set.id === currentSet.id ? updatedSet : set));
      });
    }
  };


  return (
    <Block
      style={{flex: 1, backgroundColor: colors.background, padding: sizes.md}}>
      <ScrollView contentContainerStyle={{paddingBottom: 100}}>
        {photoSets.map((set, setIndex) => (
          <Block key={set.id}>
            {set.locked && set.analysis && (
              <Text size={14} >
                {' '}
                {set.analysis.timestamp}{' '}
              </Text>
            )}
            <Block
              key={set.id}
              style={{
                borderWidth: 0.8,
                borderColor: 'gray',
                borderRadius: sizes.radius,
                borderStyle: 'dashed',
                padding: sizes.sm,
                marginBottom: sizes.md,
                backgroundColor: colors.card,
              }}>
              <Block row justify="space-between">
                {set.photos.map((photo, i) => (
                    <Block key={i} style={{width: '50%', margin: sizes.sm}} >
                    <Block alignItems='center'>
                                                              {i=== 0 &&
                                                                <Text size={12}>
                                                                  广角作业照片
                                                                </Text>}
                                          {i=== 1 &&
                                            <Text size={12}>
                                              仪表盘参数照片
                                            </Text>}
                                            </Block>
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      if (!set.locked) handlePhotoPick(i as 0 | 1);
                    }}
                    activeOpacity={0.8}
                    style={{
                      height: 100,
                      backgroundColor: '#eee',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {photo ? (
                      <Block align="center" style={{width: '100%'}}>
                        <RNImage
                          source={{uri: photo.uri}}
                          style={{
                            width: '100%',
                            height: 100,
                            borderRadius: sizes.sm,
                          }}
                        />
                      </Block>
                    ) : (

                           <Text color="gray">点击拍照</Text>

                    )}
                  </TouchableOpacity>
                  </Block>
                ))}
              </Block>

              {set.locked && set.analysis && (
                <Block style={{marginTop: sizes.sm}}>
                  <Text>{set.analysis.result}</Text>
                  <Text size={12} color="gray">
                    {set.analysis.timestamp}
                  </Text>
                </Block>
              )}

        {isWaiting && setIndex === photoSets.length - 1 &&<Spinner textContent="照片验证中..."/>}
        {set.locked && set.analysis && isAnalyzed === false && setIndex === photoSets.length - 2 &&
            <Block style={{marginTop: sizes.sm}} height={sizes.xl}>
                <Spinner textContent="系统分析中..."/>
            </Block>

            }

              {set.locked && set.analysis && isAnalyzed && isWaiting === false && (
                <Block style={{marginTop: sizes.sm}}>
                  <Text color="gray">操作指令</Text>
                  <Text size={16} bold color="colors.success">
                    增加料斗刮板输送器的转速 3 RPM

                  </Text>
                </Block>
              )}
            </Block>
          </Block>
        ))}
      </ScrollView>
    </Block>
  );
};
export default Detail;
