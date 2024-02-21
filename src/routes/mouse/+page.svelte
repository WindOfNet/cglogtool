<script lang="ts">
  import Page from '$lib/Page.svelte';
  import CgLogUpload from '$lib/CgLogUpload.svelte';
  import _ from 'lodash';
  import Table from '$lib/Table.svelte';

  let data: string[] = [];

  function handleLoaded(event: CustomEvent<{ filename: string; data: string[] }[]>) {
    data = [];
    const lines = _.flatMap(event.detail, (x) => x.data);
    for (const [index, line] of lines.entries()) {
      if (
        /交出了 大地鼠修練圖(A|B|C)。/.test(line) &&
        /交出了 大地鼠修練圖(A|B|C)。/.test(lines[index + 1]) &&
        /交出了 大地鼠修練圖(A|B|C)。/.test(lines[index + 2]) &&
        /交出了 .*。/.test(lines[index + 3])
      ) {
        const exec = /獲得了 (.*) 。/.exec(lines[index + 4]);
        exec && exec[1] && data.push(exec[1]);
      }
    }
  }

  $: tableData = _.chain(data)
    .groupBy((x) => x)
    .entries()
    .map(([n, v]) => ({ item: n, count: v }))
    .value();
</script>

<Page title="改大地鼠">
  <div class="flex flex-col space-y-5">
    <CgLogUpload on:loaded={handleLoaded} />
    {#if data}
      <div class="flex flex-col space-y-3">
        <span>共查詢到 {data.length} 筆資料</span>
        {#if data.length > 0}
          <Table
            columns={[
              { name: 'item', title: '獲得物品' },
              { name: 'count', title: '次數' }
            ]}
            data={tableData}
          />
        {/if}
      </div>
    {/if}
  </div>
</Page>
