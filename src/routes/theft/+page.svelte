<script lang="ts">
  import Page from '$lib/Page.svelte';
  import CgLogUpload from '$lib/CgLogUpload.svelte';
  import { uniq } from 'lodash';

  let data: { filename: string; message: string; thift: string; monster: string; item: string }[];
  let selectedMonster = 'all';

  function handleLoaded(event: CustomEvent<{ filename: string; data: string[] }[]>) {
    data = [];
    for (const { filename: f, data: d } of event.detail) {
      for (const line of d) {
        const exec = /^\s\d{2}:\d{2}:\d{2}.{2}(.*)從(.*)身上盜取了(.*)。/.exec(line);
        exec?.length &&
          data.push({
            filename: f,
            message: line,
            thift: exec[1],
            monster: exec[2],
            item: exec[3]
          });
      }
    }
  }
</script>

<Page title="偷竊">
  <div class="flex flex-col space-y-5">
    <CgLogUpload on:loaded={handleLoaded} />
    {#if data}
      <div class="flex flex-col space-y-3">
        <span>共查詢到 {data.length} 筆資料</span>
        {#if data.length > 0}
          <div class="form-control flex-row space-x-3">
            <label for="" class="label">
              <span class="label-text">篩選魔物</span>
            </label>
            <select class="select select-info" bind:value={selectedMonster}>
              <option value="all">全部</option>
              {#each uniq(data.map((x) => x.monster)) as m}
                {#if /(熟悉的少女|忍貓)/.test(m)}
                  <option value="cat">★熟悉的少女/忍貓</option>
                {:else if /(漁夫歐姆豪克|豪克的愛犬)/.test(m)}
                  <option value="dog">★漁夫歐姆豪克/豪克的愛犬</option>
                {:else if /(土|水|炎|風)之鬥神/.test(m)}
                  <option value="element-god">★鬥神</option>
                {:else}
                  <option value={m}>{m}</option>
                {/if}
              {/each}
            </select>
          </div>

          <div class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th>檔案</th>
                  <th>訊息</th>
                  <th>偷竊者</th>
                  <th>魔物</th>
                  <th>盜取物品</th>
                </tr>
              </thead>
              <tbody>
                {#each data.filter((x) => {
                  switch (selectedMonster) {
                    case 'all':
                      return true;
                    case 'dog':
                      return /(漁夫歐姆豪克|豪克的愛犬)/.test(x.monster);
                    case 'cat':
                      return /(熟悉的少女|忍貓)/.test(x.monster);
                    case 'element-god':
                      return /(土|水|炎|風)之鬥神/.test(x.monster);
                    default:
                      return x.monster === selectedMonster;
                  }
                }) as item}
                  <tr>
                    <td>
                      {item.filename}
                    </td>
                    <td>
                      {item.message}
                    </td>
                    <td>
                      {item.thift}
                    </td>
                    <td>
                      {item.monster}
                    </td>
                    <td>
                      {item.item}
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
