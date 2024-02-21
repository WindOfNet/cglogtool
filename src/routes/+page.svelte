<script lang="ts">
  import Page from '$lib/Page.svelte';
  import Table from '$lib/Table.svelte';
  import CgLogUpload from '../lib/CgLogUpload.svelte';

  let data: { filename: string; data: string[] }[];
  let searchType = 'normal';
  let searchText = '';
  let searchResult: { filename: string; data: string }[];
  let displayOffset = 0;
  let message = '';

  function handleLoaded(event: CustomEvent<{ filename: string; data: string[] }[]>) {
    data = event.detail;
  }

  function handleSearch() {
    message = '';

    if (!searchText) {
      message = '請輸入搜尋內容';
      return;
    }

    searchResult = [];
    for (const { filename: f, data: lines } of data) {
      for (const [index, line] of lines.entries()) {
        if (
          (searchType === 'normal' && line.includes(searchText)) ||
          (searchType === 'regex' && new RegExp(searchText).test(line))
        ) {
          searchResult.push({
            filename: f,
            data: lines[index + displayOffset]
          });
        }
      }
    }
  }
</script>

<Page title="自定義檢索">
  <div class="flex flex-col space-y-5">
    <CgLogUpload on:loaded={handleLoaded} />
    {#if data}
      <form on:submit|preventDefault={handleSearch}>
        <div class="flex flex-col space-y-3">
          <div class="form-control">
            <label for="" class="label">
              <span class="label-text">結果顯示</span>
            </label>
            <div class="flex flex-row space-x-3">
              {#each [{ name: '上一個訊息', value: -1 }, { name: '當前', value: 0 }, { name: '下一個訊息', value: 1 }] as radio}
                <label class="label space-x-2">
                  <input
                    type="radio"
                    id="display-current"
                    class="radio"
                    value={radio.value}
                    bind:group={displayOffset}
                  />
                  <span class="label-text">{radio.name}</span>
                </label>
              {/each}
            </div>
          </div>
          <div class="form-control">
            <label for="" class="label">
              <span class="label-text">檢索文字</span>
            </label>
            <div class="join w-full">
              {#each [{ name: '一般檢索', value: 'normal' }, { name: 'Regular Expression', value: 'regex' }] as radio}
                <input
                  class="join-item btn btn-neutral"
                  type="radio"
                  value={radio.value}
                  bind:group={searchType}
                  aria-label={radio.name}
                />
              {/each}
              <input
                type="text"
                class="join-item input input-bordered w-full"
                bind:value={searchText}
              />
              <button type="submit" class="join-item btn btn-neutral">Search</button>
            </div>
          </div>
          {#if message}
            <div class="text-sm text-error">{message}</div>
          {/if}
        </div>
      </form>

      {#if searchResult}
        <Table
          columns={[
            { name: 'filename', title: '檔案' },
            { name: 'data', title: '訊息' }
          ]}
          data={searchResult}
        />
      {/if}
    {/if}
  </div>
</Page>
