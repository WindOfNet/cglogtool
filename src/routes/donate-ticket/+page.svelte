<script lang="ts">
  import Page from '$lib/Page.svelte';
  import CgLogUpload from '$lib/CgLogUpload.svelte';
  import { flatMap, groupBy, orderBy } from 'lodash';

  let data: Record<string, string>[];
  let year = String(new Date().getFullYear());

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
</script>

<Page title="贊助抽獎券">
  <div class="flex flex-col space-y-5">
    <CgLogUpload on:loaded={handleLoaded} />
    <div class="form-control">
      <label for="" class="label">
        <span class="label-text">結果顯示</span>
      </label>
      <div class="flex flex-row space-x-3">
        {#each ['2020', '2021', '2022', '2023'] as y}
          <input type="radio" id={y} class="radio" value={y} bind:group={year} />
          <label for={y} class="ml-2 whitespace-nowrap">贊助抽獎券[{y}]</label>
        {/each}
      </div>
    </div>
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
                </tr>
              </thead>
              <tbody>
                {#each orderBy(Object.entries(groupBy( data.filter((x) => x['year'] === year), (x) => x['data'] )), ([, value]) => value.length, 'desc') as [key, value]}
                  <tr>
                    <td>{key}</td>
                    <td>{value.length}</td>
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
