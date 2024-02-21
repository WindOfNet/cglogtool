<script lang="ts">
  import Page from '$lib/Page.svelte';
  import CgLogUpload from '$lib/CgLogUpload.svelte';
  import _ from 'lodash';
  import fe from 'feather-icons';
  import Table from '$lib/Table.svelte';

  const years = ['2020', '2021', '2022', '2023'];

  let data: Record<string, string>[];
  let year = '2023';

  function handleLoaded(event: CustomEvent<{ filename: string; data: string[] }[]>) {
    data = [];
    const lines = _.flatMap(event.detail, (x) => x.data);
    for (const [index, line] of lines.entries()) {
      const r = /交出了 幸福火柴棒\[(.*)\]。/.exec(line);
      if (!r || !r[1]) {
        continue;
      }

      const exec = /獲得了 (.*) 。/.exec(lines[index + 1]);
      exec && exec[1] && data.push({ year: r[1], data: exec[1] });
    }
  }

  $: tableData = _.chain(data)
    .filter((x) => x['year'] === year)
    .map((x) => x.data)
    .groupBy((x) => {
      if (x === '燒完的火柴' || x === '火柴？') {
        return '燒完的火柴';
      }

      if (/弗旦(.*)/.test(x)) {
        return '弗旦裝備';
      }

      return x;
    })
    .entries()
    .map(([n, v]) => ({
      item: n,
      count: v.length,
      odds: (v.length / data.length) * 100,
      items: v
    }))
    .orderBy((x) => x.count, 'desc')
    .value();
</script>

<Page title="幸福火柴棒">
  <div class="flex flex-col space-y-5">
    <CgLogUpload on:loaded={handleLoaded} />
    <div class="form-control">
      <label for="" class="label">
        <span class="label-text">結果顯示</span>
      </label>
      <div class="flex flex-row space-x-3">
        {#each years as y}
          <label class="label space-x-2">
            <input type="radio" class="radio" value={y} bind:group={year} />
            <span class="label-text">幸福火柴棒[{y}]</span>
          </label>
        {/each}
      </div>
    </div>
    {#if data}
      <div class="flex flex-col space-y-3">
        <span>共查詢到 {tableData.length} 筆資料</span>
        {#if tableData.length > 0}
          <Table
            columns={[
              { name: 'item', title: '物品' },
              { name: 'count', title: '次數' },
              { name: 'odds', title: '機率(%)' }
            ]}
            data={tableData}
          >
            <svelte:fragment let:column let:row let:defaultValue>
              {#if column === 'count' && ['燒完的火柴', '弗旦裝備'].includes(row['item'])}
                <div class="flex flex-row space-x-3">
                  <span>
                    {row['items'].length}
                  </span>
                  <div class="dropdown dropdown-right dropdown-hover">
                    {@html fe.icons['list'].toSvg()}
                    <div class="dropdown-content p-2 shadow bg-base-100 rounded-box w-52">
                      <ul>
                        {#each _.chain(row['items'])
                          .groupBy((x) => x)
                          .entries()
                          .map(([n, v]) => ({ n, v }))
                          .value() as { n, v }}
                          <li>
                            {n}: {v.length}
                          </li>
                        {/each}
                      </ul>
                    </div>
                  </div>
                </div>
              {:else}
                {defaultValue}
              {/if}
            </svelte:fragment>
          </Table>
        {/if}
      </div>
    {/if}
  </div>
</Page>
