<script lang="ts">
  import '../app.css';
  import fe from 'feather-icons';
</script>

<div class="navbar">
  <div class="navbar-start">
    <a class="btn btn-ghost normal-case text-xl" href="/">魔力寶貝日誌工具</a>
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal p-0">
      <li><a href="/">自定義檢索</a></li>
      <li><a href="/theft">偷竊</a></li>
      <li><a href="/tree">改樹</a></li>
      <li><a href="/donate-ticket">贊助抽獎券</a></li>
      <li><a href="/happiness-matches-2022">幸福火柴棒[2022]</a></li>
      <li><a href="/easter-egg-2023">復活節彩蛋[2023]</a></li>
    </ul>
  </div>
  <div class="navbar-end mr-5">
    <a href="https://github.com/WindOfNet/cglogtool" target="__blank">
      {@html fe.icons['github'].toSvg()}
    </a>
  </div>
</div>
<div class="container mx-auto">
  <slot />
</div>
