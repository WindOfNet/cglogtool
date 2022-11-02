import React, { useState } from 'react';
import { groupBy, keys, flatMap } from 'lodash';
import PageLayout from '../components/pageLayout';
import CgLogUploader from '../components/cglogUploader';
import { Table } from 'react-bootstrap';

function Tree() {
  const [data, setData] = useState(null);
  const [groupedData, setGroupedData] = useState(null);

  return (
    <PageLayout title="改樹計算">
      <CgLogUploader
        onLoaded={(result) => {
          const lines = flatMap(result, (x) => x.data);
          const targets = [];
          for (const [index, line] of lines.entries()) {
            if (
              /交出了 樹精設計圖(A|B|C)。/.test(line) &&
              /交出了 樹精設計圖(A|B|C)。/.test(lines[index + 1]) &&
              /交出了 樹精設計圖(A|B|C)。/.test(lines[index + 2]) &&
              /交出了 .*。/.test(lines[index + 3])
            ) {
              const exec = /獲得了 (.*) 。/.exec(lines[index + 4]);
              exec && exec[1] && targets.push(exec[1]);
            }
          }
          setData(targets);

          const groupedData = groupBy(targets, (v) => v);
          setGroupedData(groupedData);
        }}
      />
      {data && (
        <div className="mt-5">
          <p>共查詢到 {data.length} 筆資料</p>
          <Table>
            <thead>
              <tr>
                <th>獲得物品</th>
                <th>次數</th>
              </tr>
            </thead>
            <tbody>
              {(data.length &&
                keys(groupedData).map((item, index) => (
                  <tr key={index}>
                    <td>{item}</td>
                    <td align="right">{groupedData[item].length}</td>
                  </tr>
                ))) || (
                <tr>
                  <td colSpan={2} align="center">
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

export default Tree;
