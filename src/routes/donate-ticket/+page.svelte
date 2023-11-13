<script lang="ts">
  import Page from '$lib/Page.svelte';
  import CgLogUpload from '$lib/CgLogUpload.svelte';
  import { flatMap, chain } from 'lodash';
  import type { Column } from '$lib/types';
  import Table from '$lib/Table.svelte';

  const years = ['2020', '2021', '2022', '2023'];
  const columns: Column[] = [
    { name: 'item', title: '物品' },
    { name: 'count', title: '次數' }
  ];

  let data: Record<string, string>[];
  let year = '2023';

  function handleLoaded(event: CustomEvent<{ filename: string; data: string[] }[]>) {
    data = [];
    const lines = flatMap(event.detail, (x) => x.data);
    for (const [index, line] of lines.entries()) {
      const r = /交出了 贊助抽獎券\[(.*)\]。/.exec(line);
      if (!r || !r[1]) {
        continue;
      }

      const exec = /獲得了 (.*) 。/.exec(lines[index + 1]);
      exec && exec[1] && data.push({ year: r[1], data: exec[1] });
    }
  }

  $: tableData = chain(data)
    .filter((x) => x['year'] === year)
    .map((x) => x.data)
    .groupBy((x) => x)
    .entries()
    .map(([n, v]) => ({ item: n, count: v.length }))
    .orderBy((x) => x.count, 'desc')
    .value();
</script>

<Page title="贊助抽獎券">
  <div class="flex flex-col space-y-5">
    <CgLogUpload on:loaded={handleLoaded} />
    <div class="form-control">
      <label for="" class="label">
        <span class="label-text">結果顯示</span>
      </label>
      <div class="flex flex-row space-x-3">
        {#each years as y}
          <input type="radio" id={y} class="radio" value={y} bind:group={year} />
          <label for={y} class="ml-2 whitespace-nowrap">贊助抽獎券[{y}]</label>
        {/each}
      </div>
    </div>
    {#if data}
      <div class="flex flex-col space-y-3">
        <span>共查詢到 {data.length} 筆資料</span>
        {#if data.length > 0}
          <Table {columns} data={tableData} />
        {/if}
      </div>
    {/if}
  </div>
</Page>
