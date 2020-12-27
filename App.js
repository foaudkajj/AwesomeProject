/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View
} from 'react-native';
import { Slider, Button, Card } from 'react-native-elements'
import RNFS from 'react-native-fs'



const App: () => React$Node = () => {

  const [bookList, setBookList] = useState([])
  const [downloadProgress, setDownloadProgress] = useState(0)

  const downloadSound = async (book) => {
    await RNFS.downloadFile({
      fromUrl: `${book.driveDirectDownloadLinkRoot}${book.driveId}`,
      toFile: `${RNFS.DownloadDirectoryPath}/${book.filename}`,
      discretionary: true,
      progressDivider: 100,
      progressInterval: 100,
      // begin: (res) => {
      //   console.log(res)
      // },
      progress: (res) => {
        const downloadPercent = (((res.bytesWritten / 1000) * 100) / book.filesizeKB)
        setDownloadProgress(downloadPercent > 100 ? 100 : downloadPercent);
      }
    })
  }

  useEffect(() => {

    (async () => {
      let response = await fetch('https://drive.google.com/uc?export=download&confirm=no_antivirus&id=1rQET21lrbycT0IcnUc89PIuaxzDgOpPh');
      let json = await response.json();
      setBookList(json);
    })()
  }, [])

  return (
    <SafeAreaView>
      <ScrollView nestedScrollEnabled={true} contentContainerStyle={{ flexGrow: 1 }}>
        <Slider maximumValue={100}
          value={downloadProgress}
        />
        {Object.entries(bookList).map(
          ([key, value]) => {
            return <Card>
              <Card.Title>{key}</Card.Title>
              <Card.Divider />
              {

                value.map((book, i) => {

                  return (
                    <View key={i}>
                      <Button
                        onPress={() => downloadSound(book)}
                        title={book.filename}
                      />
                    </View>
                  );
                })
              }
            </Card>

          }
        )}
      </ScrollView>
    </SafeAreaView>

  );
};

export default App;
