<script lang="ts">
  import Page from '$lib/Page.svelte';
  import CgLogUpload from '$lib/CgLogUpload.svelte';
  import { flatMap, groupBy } from 'lodash';

  let data: string[];

  function handleLoaded(event: CustomEvent<{ filename: string; data: string[] }[]>) {
    data = [];
    const lines = flatMap(event.detail, (x) => x.data);
    for (const [index, line] of lines.entries()) {
      if (
        /交出了 樹精設計圖(A|B|C)。/.test(line) &&
        /交出了 樹精設計圖(A|B|C)。/.test(lines[index + 1]) &&
        /交出了 樹精設計圖(A|B|C)。/.test(lines[index + 2]) &&
        /交出了 .*。/.test(lines[index + 3])
      ) {
        const exec = /獲得了 (.*) 。/.exec(lines[index + 4]);
        exec && exec[1] && data.push(exec[1]);
      }
    }
  }
</script>

<Page title="改樹">
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
                </tr>
              </thead>
              <tbody>
                {#each Object.entries(groupBy(data, (x) => x)) as [key, value]}
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
