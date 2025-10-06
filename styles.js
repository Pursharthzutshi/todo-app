// styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  appContainer: { flex: 1, backgroundColor: '#fff' },

  innerContainer: { flex: 1, padding: 22, marginTop:16},
  header: { flexDirection: 'row', justifyContent: 'space-between',  marginBottom: 12 },
  menuButton: { padding: 8 , marginTop:48},
  hamburger: { width: 22, justifyContent: 'center' },
  hamburgerLine: { height: 2, marginVertical: 2, backgroundColor: '#222' },
  searchButton: { padding: 8 },
  searchIcon: { fontSize: 18 },

  titleSection: { marginBottom: 12 },
  mainTitle: { fontSize: 28, fontWeight: '700' },
  dateText: { color: '#666', marginTop: 4 },

  filterContainer: { flexDirection: 'row', marginVertical: 12 },
  filterButton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14, marginRight: 8, backgroundColor: '#f0f0f0' },
  activeFilter: { backgroundColor: '#222' },
  filterText: { color: '#333' },
  activeFilterText: { color: '#fff' },

  addTaskContainer: { flexDirection: 'column',marginTop:12, marginBottom: 22, gap:20 },
  addTaskButton: {  height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222', marginRight: 8,paddingBottom:4 },
  plusIcon:{fontSize:22},
  addTaskIcon: { color: '#fff', fontSize: 15 },
  addTaskInput: {  borderRadius: 8, borderWidth: 1, height:50, borderColor: '#e0e0e0', paddingHorizontal: 15 },

  todoInput: { height: 44, borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0', paddingHorizontal: 10 },

  taskList: { flex: 1},

  taskCard: { flexDirection: 'row', alignItems: 'center', borderWidth:.5, padding: 12, backgroundColor: 'white', borderColor:"black", borderStyle:"solid"  },
  
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10, paddingHorizontal: 8 },
  
  searchInput: { flex: 1, height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0', paddingHorizontal: 10 },

  searchTodoInput: { borderColor:"black",marginTop:12, borderTopWidth:1,borderLeftWidth:1,borderRightWidth:1.4, borderRadius:4, height:40, paddingHorizontal:10},

  // taskCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8, backgroundColor: '#fafafa',shadowColor: '#000', shadowOffset: { width: 4, height: 2 },    elevation: 1,   shadowOpacity: 0.25, borderRadius: 10, marginBottom: 10 },
checkbox: {
  width: 30,
  height: 30,
  borderRadius: 15,
  borderWidth: 1,
  borderColor: '#D1D5DB', // soft gray
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
  backgroundColor: '#fff',
},

checkedBox: {
  borderColor: '#10B981', // modern green
  backgroundColor: '#ECFDF5', // soft mint green background
},

checkmark: {
  color: '#059669', // darker green for good contrast
  fontWeight: '900',
  fontSize: 16,
  textAlign: 'center',
},

  taskContent: { flex: 1 },
  taskTitle: { fontSize: 16 },
  completedTask: { textDecorationLine: 'line-through', color: 'red' },
  taskDetails: { color: '#777', marginTop: 4 },

  taskActions: {  display:"flex", flexDirection: 'row' ,marginLeft: 8, gap: 5, justifyContent: 'center', alignItems: 'center' },
  starIcon: { fontSize: 18 },

  fab: { position: 'absolute', right: 18, bottom: 22, width: 56, height: 56, borderRadius: 28, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  fabIcon: { color: '#fff', fontSize: 26 },

  FooterNavigationBar: { marginBottom: 50, height: 60, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, backgroundColor: 'black', color:"white" },
  navButton: { padding: 10 },
  activeNavButton: { borderTopWidth: 2, borderTopColor: '#222' },
  navText: { color: 'white' },
  activeNavText: { color: 'white',borderBlockColor:"white"},

  headerTitle: { fontSize: 18, fontWeight: '600' },
  moreButton: { padding: 8 },
  moreIcon: { fontSize: 20 },

  backButton: { padding: 8 },
  backIcon: { fontSize: 18 },

  // Progress Page 
// shadowOffset: { width: 0.5, height: 0.1 },
  progressBarBox: {display:"flex",flexDirection:"row", borderWidth:.1 , height:190, backgroundColor:"white", borderRadius:16, marginTop:20, justifyContent:"space-evenly", alignItems:"center"},

  totalTasksCompleteBox: {display:"flex" , padding: 3, flexDirection:"row" , backgroundColor:"white", borderRadius:16, marginTop:20},

  totalTasksCompleteBoxTitle: {color:"black", fontWeight:"900", fontSize:28, padding:18},

  tasksCompletionInformationParentBox: {display:"flex",  borderWidth:.1,flexDirection:"row" , height:180, backgroundColor:"white", borderRadius:16, marginTop:20, justifyContent:"space-evenly", alignItems:"center"},

  tasksCompletionInformationBox: { padding:9, width:98, borderColor:"grey" ,backgroundColor: "white", borderWidth:2, borderColor:"black", borderDashed: "dashed", display:"flex",flexDirection:"column",alignItems:"center" , textAlign:"center"},

  bottomBarBoxes:{ padding:13, width:120, height:80, borderColor:"grey" ,backgroundColor: "black", borderColor:"black", borderRadius:16, display:"flex",flexDirection:"row",alignItems:"center" , justifyContent:"center"},

  priorityTaskText:{borderStyle:"solid", borderColor:"black", justifyContent:"center", textAlign:"center", color:"white", borderRadius: 10, padding: 3 , borderWidth:1, width:70, marginTop:12}

});


// backgroundColor:"red"