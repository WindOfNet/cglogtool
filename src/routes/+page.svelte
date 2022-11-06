<script lang="ts">
  import Page from '../components/Page.svelte';
  import CgLogUpload from '../components/CgLogUpload.svelte';

  let data: { filename: string; data: string[] }[];
  let searchType = 'normal';
  let searchText = '';
  let searchResult: { filename: string; data: string }[];
  let displayOffset = 0;

  function handleLoaded(event: CustomEvent<{ filename: string; data: string[] }[]>) {
    data = event.detail;
  }

  function handleSearch() {
    if (!searchText) {
      return;
    }

    searchResult = [];
    for (const { filename: f, data: lines } of data) {
      for (const line of lines) {
        if (
          (searchType === 'normal' && line.includes(searchText)) ||
          (searchType === 'regex' && new RegExp(searchText).test(line))
        ) {
          searchResult.push({
            filename: f,
            data: lines[lines.indexOf(line) + displayOffset]
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
              <span class="label-text">檢索文字</span>
            </label>
            <div class="input-group w-full">
              <span>
                <input
                  type="radio"
                  id="normal"
                  class="radio"
                  value="normal"
                  bind:group={searchType}
                />
                <label for="normal" class="ml-2 whitespace-nowrap">一般檢索</label>
              </span>
              <span>
                <input
                  type="radio"
                  id="regex"
                  class="radio"
                  value="regex"
                  bind:group={searchType}
                />
                <label for="regex" class="ml-2 whitespace-nowrap">Regular Expression</label>
              </span>
              <input type="text" class="input input-bordered w-full" bind:value={searchText} />
              <button type="submit" class="btn">Search</button>
            </div>
          </div>
          <div class="form-control">
            <label for="" class="label">
              <span class="label-text">結果顯示</span>
            </label>
            <div class="flex flex-row space-x-3">
              <input
                type="radio"
                id="display-current"
                class="radio"
                value={0}
                bind:group={displayOffset}
              />
              <label for="display-current" class="ml-2 whitespace-nowrap">當前</label>
              <input
                type="radio"
                id="display-next"
                class="radio"
                value={1}
                bind:group={displayOffset}
              />
              <label for="display-next" class="ml-2 whitespace-nowrap">下一個訊息</label>
            </div>
          </div>
        </div>
      </form>
      {#if searchResult}
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th>檔案</th>
                <th>訊息</th>
              </tr>
            </thead>
            <tbody>
              {#each searchResult as { filename, data }}
                <tr>
                  <td>
                    {filename}
                  </td>
                  <td>
                    {data}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    {/if}
  </div>
</Page>
