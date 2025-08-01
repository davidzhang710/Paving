import React, {useCallback, useLayoutEffect, useState} from 'react';

import {useData, useTheme, useTranslation} from '../hooks/';
import {Block, Button, Image, Input, Product, Text} from '../components/';
import { ScrollView, TouchableOpacity } from 'react-native';

const Home = ({ navigation }) => {
  const {t} = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const {following, trending} = useData();
  const [products, setProducts] = useState(following);
  const {assets, colors, fonts, gradients, sizes, icons} = useTheme();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [machines, setMachines] = useState([])
  const toggleAddMenu = () => setShowAddMenu((prev) => !prev);

 // For selection of machines
 const [showDeviceTypeModal, setShowDeviceTypeModal] = useState(false);
 const [selectedDevice, setSelectedDevice] = useState<'摊铺机' | '拌合站' | null>(null);


  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      setProducts(tab === 0 ? following : trending);
    },
    [following, trending, setTab, setProducts],
  );
    useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={toggleAddMenu}>

            <Image
              source={icons.more}
              radius={0}
              color={colors.primary}
              style={{ marginRight: sizes.sm }} // 👈 add your desired margin here
            />
          </TouchableOpacity>
        ),
      });
    }, [navigation, toggleAddMenu]);


  return (
<Block style={{ flex: 1, backgroundColor: colors.background }}>
  {/* your main content */}

    {showAddMenu && (
          <Block
            position="absolute"
            top={0}
            left={0}
            right={0}
            zIndex={999}
            padding={sizes.sm}
            backgroundColor={colors.card}
            shadow
            radius={sizes.radius}
          >
            <Button
              gradient={gradients.primary}
              onPress={() => {
                setShowAddMenu(false);
                setShowDeviceTypeModal(true); // show second modal
              }}
            >
              <Text white bold style={{ fontSize: 18 }}>
                ＋ 添加设备
              </Text>
            </Button>
          </Block>
        )}

         {showDeviceTypeModal && (
           <Block
             position="absolute"
             top={0}
             left={0}
             right={0}
             bottom={0}
             zIndex={1000}
             backgroundColor="rgba(0,0,0,0.6)" // dimmed background
             justify="center"
             align="center"
           >
             <Block
               width="80%"
               padding={sizes.md}
               radius={sizes.radius}
               backgroundColor={colors.white}
               shadow
             >
               <Text bold size={20} center style={{ marginBottom: sizes.sm }}>
                 请选择设备类型
               </Text>

<Block style={{ alignSelf: 'center' }} padding={sizes.sm}>
  {['摊铺机', '拌合楼'].map((item) => (
    <TouchableOpacity
      key={item}
      onPress={() => setSelectedDevice(item)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: sizes.sm,
      }}
      activeOpacity={0.8}
    >
      <Block
        style={{
          width: 12,
          height: 12,
          borderRadius: 8,

          borderColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: sizes.sm,
        }}
      >
        {selectedDevice === item && (
          <Block
            style={{
              width: 12,
              borderRadius: 100,
              backgroundColor: colors.primary,
            }}
          />
        )}
      </Block>
      <Text size={16}>{item}</Text>
    </TouchableOpacity>
  ))}
</Block>

               <Button
                 gradient={gradients.primary}
                 onPress={() => {
                   if (selectedDevice) {
                     setShowDeviceTypeModal(false);
                     // Proceed with selectedDevice value
                     console.log('Selected device type:', selectedDevice);
                     setMachines([...machines, selectedDevice])
                     setSelectedDevice(null);
                   }
                 }}
                 style={{ marginTop: sizes.md }}
               >
                 <Text white bold>确认</Text>
               </Button>
             </Block>
           </Block>)}


<ScrollView
  contentContainerStyle={{
    flexGrow: 1,
    alignItems: 'center', // horizontal alignment
    justifyContent: 'flex-start', // vertical alignment if needed
    gap: sizes.sm,
    paddingVertical: sizes.sm, // optional for spacing
  }}
>
  {machines.map((_, index) => ( //change to machines.map to add device
       <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate('Detail', { id: index + 1 })}
            activeOpacity={0.8}
          >
    <Block
      key={index}
      style={{
        width: 350,
        height: 180,
        maxHeight: 160,
        borderWidth: 0.8,
        borderColor: colors.secondary,
        borderStyle: 'dashed',
        borderRadius: sizes.radius,
        padding: sizes.sm,
        alignItems: 'center',
        backgroundColor: colors.card,
      }}
    >
      <Image
        source={require('../assets/images/paver.jpg')}
        resizeMode="contain"
        style={{
          width: 100,
          height: 80,
          borderRadius: sizes.sm,
        }}
      />
      <Text
        style={{
          marginTop: sizes.sm,
          color: colors.text,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        {machines[index]} {index + 1}
      </Text>
    </Block>
      </TouchableOpacity>
  ))}
</ScrollView>


</Block>

  );
};

export default Home;
