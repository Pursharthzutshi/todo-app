import { View } from 'react-native';
import getVisibleTasks from './VisibleTasks';
import { useMemo } from 'react';
import { ScrollView } from 'react-native';
import TaskCard from './TaskCard';
import { TextInput } from 'react-native';
import { Text } from 'react-native';

export default function WishlistPage({styles,searchAllTodoListItem,  filteredTasks = [],setTasks,setSearchAllTodoListItem,toggleWishlist}) {

const tasksToShow = useMemo(
        () => getVisibleTasks(filteredTasks, searchAllTodoListItem),
        [filteredTasks, searchAllTodoListItem]
      );
    

return(
    
    <View style={styles.innerContainer}>

        <Text style={{fontSize:30,marginTop:10,fontWeight:500}}>Wishlist </Text>


              <TextInput
                style={styles.searchTodoInput}
                placeholder="Search Your Todo's"
                placeholderTextColor="#999"
                value={searchAllTodoListItem}
                onChangeText={setSearchAllTodoListItem}
                returnKeyType="search"
              />
        
  <ScrollView style={styles.taskList}>

        {tasksToShow.filter((task) => (
            task.wishlist === true
        )).map((task) => (
            <TaskCard
            key={task.id}
            task={task}
            setTasks={setTasks}
            styles={styles}
            onToggleWishlist={() => toggleWishlist(task.id)}
          /> 
        ))}
        

      </ScrollView>
    </View>
)
}