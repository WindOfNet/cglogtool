import React, { useEffect, useState } from 'react';
import PageLayout from '../components/pageLayout';
import CgLogUploader from '../components/cglogUploader';
import { Table, Form, Row, Col } from 'react-bootstrap';
import { uniqBy } from 'lodash';

function Theft() {
  const [data, setData] = useState(null);
  const [monsterOptions, setMonsterOptions] = useState([]);
  const [selectedMonster, setSelectedMonster] = useState('全部');
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    setFilteredData(null);
    let options = [{ name: '全部', value: '全部' }];
    if (data) {
      options = options.concat(
        uniqBy(
          data.map((x) => {
            const m = x.monster;

            if (/(忍貓|熟悉的少女)/.test(m)) {
              return { name: '忍貓★', value: '忍貓' };
            }

            if (/豪克/.test(m)) {
              return { name: '豪克的愛犬★', value: '豪克的愛犬' };
            }

            if (/.之鬥神/.test(m)) {
              return { name: '鬥神★', value: '鬥神' };
            }

            return { name: m, value: m };
          }),
          'value'
        )
      );
    }
    setMonsterOptions(options);
    setSelectedMonster(options[0].value);
  }, [data]);

  useEffect(() => {
    if (!data) {
      return;
    }

    setFilteredData(
      (selectedMonster === '全部' && [...data]) ||
        data.filter((x) => {
          if (selectedMonster === '忍貓') {
            return /(忍貓|熟悉的少女)/.test(x.monster);
          }

          if (selectedMonster === '豪克的愛犬') {
            return /(豪克的愛犬|漁夫歐姆豪克)/.test(x.monster);
          }

          if (selectedMonster === '鬥神') {
            return /.之鬥神/.test(x.monster);
          }

          return x.monster === selectedMonster;
        })
    );
  }, [data, selectedMonster]);

  return (
    <PageLayout title="偷竊">
      <CgLogUploader
        onLoaded={(result) => {
          const results = [];
          for (const item of result) {
            for (const line of item.data) {
              const exec =
                /^\s\d{2}:\d{2}:\d{2}.{2}(.*)從(.*)身上盜取了(.*)。/.exec(line);
              exec?.length &&
                results.push({
                  file: item.file,
                  text: line,
                  thift: exec[1],
                  monster: exec[2],
                  item: exec[3],
                });
            }
          }

          setData(results);
        }}
      />
      {filteredData && (
        <div className="mt-5">
          <Form>
            <Form.Group as={Row} xs="auto">
              <Col>
                <Form.Label column>顯示魔物</Form.Label>
              </Col>
              <Col>
                <Form.Select
                  value={selectedMonster}
                  onChange={(e) => {
                    setSelectedMonster(e.target.value);
                  }}
                >
                  {monsterOptions.map((x, index) => (
                    <option key={index} value={x.value}>
                      {x.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col>
                <Form.Label column>
                  共查詢到 {filteredData.length} 筆資料
                </Form.Label>
              </Col>
            </Form.Group>
          </Form>
          <Table className="mt-2">
            <thead>
              <tr>
                <th>檔案</th>
                <th>訊息</th>
                <th>偷竊者</th>
                <th>魔物</th>
                <th>盜取物品</th>
              </tr>
            </thead>
            <tbody>
              {(filteredData.length &&
                filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.file}</td>
                    <td>{item.text}</td>
                    <td>{item.thift}</td>
                    <td>{item.monster}</td>
                    <td>{item.item}</td>
                  </tr>
                ))) || (
                <tr>
                  <td colSpan={5} align="center">
                    查無結果
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </PageLayout>
  );
}

export default Theft;
