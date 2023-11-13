<script lang="ts">
  import Page from '$lib/Page.svelte';
  import CgLogUpload from '$lib/CgLogUpload.svelte';
  import { flatMap, groupBy, orderBy } from 'lodash';
  import fe from 'feather-icons';

  let data: string[];

  function handleLoaded(event: CustomEvent<{ filename: string; data: string[] }[]>) {
    data = [];
    const lines = flatMap(event.detail, (x) => x.data);
    for (const [index, line] of lines.entries()) {
      if (line.includes('交出了 復活節彩蛋[2023]。')) {
        const exec = /獲得了 (.*) 。/.exec(lines[index + 1]);
        exec && exec[1] && data.push(exec[1]);
      }
    }
  }
</script>

<Page title="復活節彩蛋[2023]">
  <div class="flex flex-col space-y-5">
    <CgLogUpload on:loaded={handleLoaded} />
    {#if data}
      <div class="flex flex-col space-y-3">
        <span>共查詢到 {data.length} 筆資料</span>
        {#if data.length > 0}
          <div class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th>獲得物品</th>
                  <th>次數</th>
                  <th>機率</th>
                </tr>
              </thead>
              <tbody>
                {#each orderBy(Object.entries(groupBy(data, (x) => {
                      if (x === '燒完的火柴' || x === '火柴？') {
                        return '燒完的火柴';
                      }

                      if (/弗旦(.*)/.test(x)) {
                        return '弗旦裝備';
                      }

                      return x;
                    })), ([, value]) => value.length, 'desc') as [groupedItem, groupedData]}
                  <tr>
                    <td>{groupedItem}</td>
                    <td>
                      <div class="flex flex-row space-x-3">
                        <span>
                          {groupedData.length}
                        </span>
                        {#if ['燒完的火柴', '弗旦裝備'].includes(groupedItem)}
                          <div class="dropdown dropdown-right dropdown-hover">
                            {@html fe.icons['list'].toSvg()}
                            <div class="dropdown-content p-2 shadow bg-base-100 rounded-box">
                              <ul>
                                {#each Object.entries(groupBy(groupedData, (v) => v)) as [detailItemName, detailData]}
                                  <li>
                                    {detailItemName}: {detailData.length}
                                  </li>
                                {/each}
                              </ul>
                            </div>
                          </div>
                        {/if}
                      </div>
                    </td>
                    <td>
                      {(groupedData.length / data.length) * 100}%
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</Page>
