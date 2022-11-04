import React, { useState, useEffect } from 'react';
import { flatMap, groupBy, keys, orderBy } from 'lodash';
import PageLayout from '../components/pageLayout';
import CgLogUploader from '../components/cglogUploader';
import { Table } from 'react-bootstrap';

function DonateTicket() {
  const [data, setData] = useState(null);
  const [groupedData, setGroupedData] = useState(null);

  const handleUploaded = (result) => {
    const lines = flatMap(result, (x) => x.data);
    const targets = [];
    for (const [index, line] of lines.entries()) {
      if (/交出了 贊助抽獎券\[.*\]。/.test(line)) {
        const exec = /獲得了 (.*) 。/.exec(lines[index + 1]);
        exec && exec[1] && targets.push(exec[1]);
      }
    }

    setData(targets);
  };

  useEffect(() => {
    const g = groupBy(data, (v) => v);
    setGroupedData(g);
  }, [data]);

  return (
    <PageLayout title="贊助抽獎券">
      <CgLogUploader onLoaded={handleUploaded} />
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
              {(groupedData &&
                orderBy(
                  keys(groupedData),
                  (k) => groupedData[k].length,
                  'desc'
                ).map((g, index) => (
                  <tr key={index}>
                    <td>{g}</td>
                    <td align="right">{groupedData[g].length}</td>
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

export default DonateTicket;
