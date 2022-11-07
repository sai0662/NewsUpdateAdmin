const [useData, setUserData] = useState(null);
const [state, setState] = useState({
  loading: true,
  data: [],
  postData: [],
  commentsData: [],
});
const [current_user, set_current_user] = useState(null);
const [visited, setVisited] = useState([]);
const [filter, setFilter] = useState(null);

useEffect(() => {
  getVisitedData();
  getData();
}, []);

//Getting Data from FireStore
const getData = () => {
  var myData = [];
  firestore()
    .collection('newposts')
    .get()
    .then(snapShot => {
      console.log('getData', snapShot);
      snapShot.docs.map(each => {
        console.log('data', each.data(), each.id);
        myData.push({...each.data(), id: each.id});
        setState(prev => ({...prev, loading: false, data: myData}));
        console.log('all rows', myData.length);
      });
    })
    .catch(error => {
      console.log('error', error);
      setState(prev => ({...prev, loading: false}));
      toast.show('network problem', toast.LONG);
    });
};

// Going to Details Page
const visitDetail = async (id, description, title, image, getData) => {
  var tempVisited = visited;
  if (tempVisited.indexOf(id) === -1) {
    tempVisited.push(id);
  }
  setVisited([...tempVisited]);

  try {
    var converttoString = JSON.stringify(tempVisited);
    await AsyncStorage.setItem('@visitedposts', converttoString);
  } catch (e) {
    console.log('error', e);
  }

  navigation.navigate(
    'Details',
    {
      id: id,
      description: description,
      title: title,
      image: image,
    },
    {reloadData: getData},
  );
};

const getVisitedData = async () => {
  try {
    let jsonValue = await AsyncStorage.getItem('@visitedposts');
    if (jsonValue !== null) {
      jsonValue = JSON.parse(jsonValue);
      setVisited(jsonValue);
    }
  } catch (e) {
    console.log('error', e);
  }
};

useEffect(() => {
  console.log('visited', visited);
}, [visited]);

const UnRead = async id => {
  var tempVisited = visited;
  if (tempVisited.indexOf(id) !== tempVisited) {
    tempVisited.pop(id);
  }
  setVisited([...tempVisited]);

  try {
    var converttoString = JSON.stringify(tempVisited);
    await AsyncStorage.setItem('@visitedposts', converttoString);
  } catch (e) {
    console.log('error', e);
  }
};

// const Signout = () => {
//   auth()
//     .signOut()
//     .then(() => console.log('User signed out'));
//   GoogleSignin.signOut();
//   set_current_user(null);
// };

// const filterData = () => {
//   const filteredData = _.filter(each.state, each => {
//     return each.status === true;
//   });
//   console.log('filteredData', filterData);
//   setState(filteredData);
// };

//////////////////////////////////////////////////////

{
  state.data.map(data => (
    <TouchableOpacity
      onPress={() => {
        visitDetail(data.id, data.description, data.title, data.image),
          {reloadData: getData};
      }}
      key={data.id}>
      <View
        style={[
          styles.postView,
          {
            backgroundColor:
              visited.indexOf(data.id) !== -1 ? 'lightblue' : 'white',
          },
        ]}>
        <View style={styles.titleview}>
          <Text style={styles.titleText}>{data.title}</Text>
        </View>
        <Text style={{color: 'green'}}>{data.catName}</Text>
        {/* <View
          style={{
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}>
          <TouchableOpacity onPress={() => UnRead(data.id)}>
            <Text
              style={{
                color: visited.indexOf(data.id) !== -1 ? 'green' : 'red',
              }}>
              {visited.indexOf(data.id) !== -1 ? 'read' : 'unread'}
            </Text>
          </TouchableOpacity>
        </View> */}
        <View style={styles.description}>
          <View style={styles.descriptionView}>
            <Text style={styles.descriptionText}>{data.description}</Text>
          </View>
          <View style={styles.ImageView}>
            <Image source={{uri: data.image}} style={styles.ImageSize} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ));
}




////////////unread

 {/* <View
          style={{
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}>
          <TouchableOpacity onPress={() => UnRead(data.id)}>
            <Text
              style={{
                color: visited.indexOf(data.id) !== -1 ? 'green' : 'red',
              }}>
              {visited.indexOf(data.id) !== -1 ? 'read' : 'unread'}
            </Text>
          </TouchableOpacity>
        </View> */}