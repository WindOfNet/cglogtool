<script lang="ts">
  import type { Column } from '$lib/types';

  export let columns: Column[];
  export let data: Record<string, any>[];
</script>

<div class="overflow-x-auto">
  <table class="table w-full">
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
