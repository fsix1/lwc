import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Keyboard,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {connect} from 'react-redux';
import AppColor from '../modules/AppColor';
import {
  addVideoComment,
  getVideoComment,
} from '../statemanagement/actions/commentAction';

const VideoPlayerScreen = ({
  VideoURI,
  video,
  onBack,
  comments,
  addVideoComment,
  getVideoComment,
  user,
}) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [comment, setComment] = useState('');
  const [sendButton, setSendButton] = useState(false);
  const isInitialMount = useRef(true);
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    console.log('user', user);
  }, []);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      // getVideoComment({training_id: VideoURI.train_ram});
    }
  }, [addVideoComment]);
  const _keyboardDidShow = (e) => {
    setKeyboardHeight(e.endCoordinates.height);
    setSendButton(true);
  };

  const _keyboardDidHide = () => {
    setKeyboardHeight(0);
  };
  const submitPostHandler = () => {
    addVideoComment({
      comment_body: comment,
      training_id: VideoURI.train_ram,
      userId: user.userId,
    });

    getVideoComment({training_id: VideoURI.train_ram});
    setComment('');
    Keyboard.dismiss();
  };
  const onChange = (text) => {
    setComment(text);
  };
  return (
    <View
      style={{
        flex: 1,
        // marginBottom: keyboardHeight + inputHeight
        bottom: keyboardHeight / 6,
      }}>
      <View
        style={{
          height: 300,
          backgroundColor: 'red',
        }}>
        {/* <VideoPlayer
          seekColor={AppColor.PRIMARY_COLOR}
          disableVolume={true}
          disableFullscreen={true}
          onBack={onBack}
          controls={true}
          source={{
            uri: VideoURI.video_file,
          }}
        /> */}
      </View>

      <View>
        <Text style={{marginLeft: 10}}>{VideoURI.topic}</Text>
        <Text style={{marginLeft: 10, color: AppColor.SECONDARY_COLOR}}>
          {VideoURI.facilitator}
        </Text>
        <Text style={{marginLeft: 10, color: AppColor.SECONDARY_COLOR}}>
          {'Category Remedial'}
        </Text>
        <Text
          style={{
            marginLeft: 10,
            color: AppColor.SECONDARY_COLOR,
          }}>{`Synopsis \n${VideoURI.description}`}</Text>
        <Text style={{marginLeft: 10}}>{'Comments (6)'}</Text>

        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 3,
              borderColor: AppColor.SECONDARY_COLOR,
              marginVertical: 4,
            }}>
            <Icon
              style={{marginHorizontal: 15}}
              name="account-circle"
              size={25}
              color={AppColor.SECONDARY_COLOR}
            />

            <TextInput
              multiline={true}
              value={comment}
              onChangeText={(text) => onChange(text)}
              returnKeyType="send"
              onFocus={() => setSendButton(true)}
              style={{
                width: '75%',
              }}
              placeholder="Add a comment"
            />
            {sendButton ? (
              <TouchableOpacity onPress={submitPostHandler}>
                <Icon
                  // style={{marginHorizontal: 15}}
                  name="send"
                  size={35}
                  color={AppColor.PRIMARY_COLOR}
                />
              </TouchableOpacity>
            ) : (
              <View></View>
            )}
          </View>
        </View>
      </View>

      {comments.length < 1 ? (
        <View>
          <Text>No comment yet</Text>
        </View>
      ) : (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={comments}
          renderItem={({item}) => (
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: AppColor.SECONDARY_COLOR,
              }}>
              <Icon
                style={{marginHorizontal: 10}}
                name="account-circle"
                size={40}
                color={AppColor.SECONDARY_COLOR}
              />
              <View style={{marginHorizontal: 10, width: '80%'}}>
                <Text style={{fontWeight: 'bold', color: AppColor.BLACK}}>
                  {`${item.name} `}
                  <Text
                    style={{
                      fontSize: 10,
                      color: AppColor.SECONDARY_COLOR,
                    }}>
                    {item.created_at}
                  </Text>
                </Text>
                <Text>{item.comment_body}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};
const mapStateToProps = (state) => ({
  comments: state.comments.comments,
  video: state.video,
  user: state.auth.user,
});
export default connect(mapStateToProps, {addVideoComment, getVideoComment})(
  VideoPlayerScreen,
);
