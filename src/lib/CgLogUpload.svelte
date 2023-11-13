<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ loaded: { filename: string; data: string[] }[] }>();
  let processing = false;

  function readCgLog(file: File): Promise<string> {
    return new Promise((resolve) => {
      const fr = new FileReader();
      fr.onload = (e) => {
        resolve(e.target?.result as string);
      };
      fr.readAsText(file, 'big5');
    });
  }

  async function handleChange(e: Event) {
    const eventTarget = e.target as HTMLInputElement;
    if (!eventTarget?.files?.length) {
      return;
    }

    const files = eventTarget.files;
    processing = true;

    setTimeout(async () => {
      const result: { filename: string; data: string[] }[] = [];

      for (const file of files) {
        const text = await readCgLog(file);
        const resultInFile: string[] = [];

        for (const line of text.split('\n')) {
          if (resultInFile.at(-1) === line) {
            continue;
          }
          resultInFile.push(line);
        }
        result.push({ filename: file.name, data: resultInFile });
      }

      processing = false;
      dispatch('loaded', result);
    });
  }
</script>

<div class="form-control w-full">
  <label for="" class="label">
    <span class="label-text">上傳魔力寶貝 LOG (可多選)</span>
  </label>
  <input
    class="file-input file-input-bordered w-full"
    type="file"
    multiple
    accept=".txt"
    on:change={handleChange}
  />
  {#if processing}
    <label for="" class="label">
      <span class="label-text-alt">檔案解析中 ...</span>
    </label>
  {/if}
</div>
