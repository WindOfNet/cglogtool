import { useState } from "react";
import { groupBy, keys, flatMap } from "lodash";
import ReactTooltip from "react-tooltip";
import "@fortawesome/fontawesome-free/css/fontawesome.css";
import "@fortawesome/fontawesome-free/css/brands.css";
import "@fortawesome/fontawesome-free/css/solid.css";
import PageLayout from "../components/pageLayout";
import CgLogUploader from "../components/cglogUploader";
import { Table } from "react-bootstrap";

function MouseBooty() {
  const [data, setData] = useState(null);
  const [groupedData, setGroupedData] = useState(null);
  const [tooltip, showTooltip] = useState(true);

  return (
    <PageLayout title="遊行禮盒計算">
      <CgLogUploader
        onLoaded={(result) => {
          const lines = flatMap(result, (x) => x.data);
          const targets = [];
          for (const [index, line] of lines.entries()) {
            if (line.includes("交出了 遊行禮盒。")) {
              targets.push(/獲得了 (.*) 。/.exec(lines[index + 1])[1]);
            }
          }
          setData(targets);

          const groupedData = groupBy(targets, (v) => {
            if (/(.*)經驗(.*)手環(.*)/.test(v)) {
              return "經驗手環";
            }

            return v;
          });
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
                    <td align="right">
                      {groupedData[item].length}
                      {item === "經驗手環" && (
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
                              const g = groupBy(groupedData[item]);
                              return keys(g)
                                .map((x) => `${x}: ${g[x].length}`)
                                .join("<br />");
                            })()}
                          ></i>
                          {tooltip && <ReactTooltip multiline place="right" />}
                        </>
                      )}
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

export default MouseBooty;
