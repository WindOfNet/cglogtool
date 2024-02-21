<script lang="ts">
  import type { Column } from '$lib/types';
  import domtoimage from 'dom-to-image';

  export let columns: Column[];
  export let data: Record<string, any>[];

  let tableRef: HTMLElement;

  function handleScreenshot() {
    const clone = tableRef.cloneNode(true) as HTMLElement;
    clone.setAttribute('data-theme', 'light');
    clone.classList.add('max-w-[800px]');
    document.body.appendChild(clone);
    domtoimage.toPng(clone).then(function (dataUrl) {
      clone.remove();
      const w = window.open('');
      var img = new Image();
      img.src = dataUrl;
      w?.document.write(img.outerHTML);
    });
  }
</script>

<div class="text-end">
  <button class="btn btn-primary btn-sm" on:click={handleScreenshot}>匯出成圖片</button>
</div>
<div class="overflow-x-auto">
  <table class="table w-full" bind:this={tableRef}>
    <thead>
      <tr>
        {#each columns as column}
          <th>{column.title}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each data as row}
        <tr>
          {#each columns as { name }}
            <td>
              <slot column={name} {row} defaultValue={row[name]}>
                {row[name] ?? ''}
              </slot>
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
