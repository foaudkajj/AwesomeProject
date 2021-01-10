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

  const downloadSound = async (booksTitle, bookList) => {
    let downloadedBooksCount = 0;
    const booksCount = bookList.length;
    for (const book of bookList) {
      let result = await RNFS.downloadFile({
        fromUrl: `${book.driveDirectDownloadLinkRoot}${book.driveId}`,
        toFile: `${RNFS.ExternalDirectoryPath}/${book.filename}`,
        discretionary: true,
        progressDivider: 100,
        progressInterval: 100,
        begin: (res) => {
          downloadedBooksCount += 1;
          console.log(`${downloadedBooksCount}. Kayıt İndirilmeye Başlandı`)
        },
        // progress: (res) => {
        //   const downloadPercent = ((((res.bytesWritten / 1000) * 100) / book.filesizeKB))
        //   console.log(downloadPercent)
        //   setDownloadProgress(downloadPercent > 100 ? 100 : downloadPercent);
        // }
      }).promise;
      console.log(result.statusCode)
      setDownloadProgress((downloadedBooksCount / booksCount) * 100);
    }

    if (downloadedBooksCount == booksCount) {
      console.log("İndirme Tamamlanı")
    }

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
          ([booksTitle, bookList]) => {
            return <Card>
              <Card.Title>{booksTitle}</Card.Title>
              <Card.Divider />
              {
                <View key={booksTitle}>
                  <Button
                    onPress={() => downloadSound(booksTitle, bookList)}
                    title={'İndir'}
                  />
                </View>
              }
            </Card>

          }
        )}
      </ScrollView>
    </SafeAreaView>

  );
};

export default App;
