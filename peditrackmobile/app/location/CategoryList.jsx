import { View, Text, FlatList, TouchableOpacity} from 'react-native'
import {React, useState} from 'react'
import CategoryItem from './CategoryItem'

export default function CategoryList({setSelectedCategory}) {
    const categoryList = [
        {
            id: 1,
            name: 'Hospitals',
            value: 'hospital',
            color: '#F3F4F6'
            },
            {
            id: 2,
            name: 'Pharmacies',
            value: 'pharmacy',
            color: '#F3F4F6'
            },
            {
            id: 3,
            name: 'MOHs',
            value: 'medical_lab',
            color: '#F3F4F6'
            },
            {
            id: 4,
            name: 'Private Hospitals',
            value: 'dental_clinic',
            color: '#F3F4F6'
            },
            {
            id: 5,
            name: 'Dispensaries',
            value: 'doctor',
            color: '#F3F4F6'
        }
    ]

    const handleSelectCategory = (category) => {
      setLocalSelectedCategory(category.value); // Update local state
      setParentSelectedCategory(category.value); // Update parent state
    };

  return (
    <View style={{marginTop:15}}>
      <FlatList
       data={categoryList}
       horizontal={true}
       keyExtractor={(item) => item.id.toString()} // Add key extractor
       nestedScrollEnabled={true}
       renderItem={({item}) => (
           <TouchableOpacity onPress={() =>setSelectedCategory(item.name)}>
              <CategoryItem 
              category={item}
              />
           </TouchableOpacity>
       )}
      />
    </View>
  )
}