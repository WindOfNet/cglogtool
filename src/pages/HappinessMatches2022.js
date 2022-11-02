import React, { useState, useEffect } from 'react';
import { flatMap, groupBy, keys, orderBy } from 'lodash';
import PageLayout from '../components/pageLayout';
import CgLogUploader from '../components/cglogUploader';
import { Table } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/brands.css';
import '@fortawesome/fontawesome-free/css/solid.css';

function HappinessMatches2022() {
  const [data, setData] = useState(null);
  const [groupedData, setGroupedData] = useState(null);
  const [tooltip, showTooltip] = useState(true);

  const handleUploaded = (result) => {
    const lines = flatMap(result, (x) => x.data);
    const targets = [];
    for (const [index, line] of lines.entries()) {
      if (line.includes('交出了 幸福火柴棒[2022]。')) {
        const exec = /獲得了 (.*) 。/.exec(lines[index + 1]);
        exec && exec[1] && targets.push(exec[1]);
      }
    }
    setData(targets);
  };

  useEffect(() => {
    const g = groupBy(data, (v) => {
      if (/弗旦(.*)/.test(v)) {
        return '弗旦裝備';
      }

      if (v === '燒完的火柴' || v === '火柴？') {
        return '燒完的火柴';
      }

      return v;
    });

    setGroupedData(g);
  }, [data]);

  return (
    <PageLayout title="幸福火柴棒[2022]">
      <CgLogUploader onLoaded={handleUploaded} />
      {data && (
        <div className="mt-5">
          <p>共查詢到 {data.length} 筆資料</p>
          <Table>
            <thead>
              <tr>
                <th>獲得物品</th>
                <th>次數</th>
                <th>機率</th>
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
                    <td align="right">
                      {groupedData[g].length}
                      {(g === '弗旦裝備' || g === '燒完的火柴') && (
                        <>
                          <i
                            className="fa-solid fa-list"
                            style={{ marginLeft: 5 }}
                            onMouseEnter={() => showTooltip(true)}
                            onMouseLeave={() => {
                              showTooltip(false);
                              setTimeout(() => showTooltip(true), 50);
                            }}
                            data-tip={(() => {
                              const gi = groupBy(groupedData[g]);
                              return orderBy(
                                keys(gi),
                                (k) => gi[k].length,
                                'desc'
                              )
                                .map((x) => `${x}: ${gi[x].length}`)
                                .join('<br />');
                            })()}
                          ></i>
                          {tooltip && <ReactTooltip multiline place="right" />}
                        </>
                      )}
                    </td>
                    <td align="right">
                      {(groupedData[g].length / data.length) * 100}%
                    </td>
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

export default HappinessMatches2022;
