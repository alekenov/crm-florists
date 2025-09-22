import svgPaths from "./svg-q947iwbrfb";
import imgRectangle from "figma:asset/d1e4a43dfd35275968d7a4b44aa8a93a79982faa.png";
import imgRectangle1 from "figma:asset/438350a0f5172f1ab210cb733df6869e0b9f8ef5.png";

function Search21() {
  return (
    <div className="absolute size-4 top-[130px]" data-name="search (2) 1" style={{ left: "calc(83.333% + 9.333px)" }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2_229)" id="search (2) 1">
          <path d={svgPaths.p26df9e00} fill="var(--fill-0, #B3B3B3)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_2_229">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group60() {
  return (
    <div className="absolute contents top-[130px]" style={{ left: "calc(83.333% + 9.333px)" }}>
      <Search21 />
    </div>
  );
}

function Group80() {
  return (
    <div className="absolute contents left-4 top-[115px]">
      <div className="absolute h-[46px] left-4 top-[115px] w-72" data-name="Rectangle 3.52">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 288 46">
          <path d={svgPaths.p3df90800} fill="var(--fill-0, white)" id="Rectangle 3.52" stroke="var(--stroke-0, #E9E9E9)" />
        </svg>
      </div>
      <div className="absolute font-['Open_Sans:Regular',_sans-serif] font-normal leading-[0] text-[#828282] text-[16px] text-nowrap top-[127px] translate-x-[100%]" style={{ fontVariationSettings: "'wdth' 100", right: "calc(66.667% + 78.667px)" }}>
        <p className="leading-[normal] whitespace-pre">Найти</p>
      </div>
      <Group60 />
    </div>
  );
}

function Group81() {
  return (
    <div className="absolute h-6 top-[229px] w-11" style={{ left: "calc(83.333% - 6.667px)" }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 24">
        <g id="Group 81">
          <rect fill="var(--fill-0, #0CB798)" height="24" id="Rectangle 4" rx="12" width="44" />
          <circle cx="32" cy="12" fill="var(--fill-0, white)" id="Ellipse 1" r="10" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[6.25%_6.25%_6.44%_6.25%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d={svgPaths.p6aa1080} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[6.25%_59.94%_59.94%_6.25%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
        <g id="Group">
          <path d={svgPaths.p550035} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[6.25%_33.19%_59.94%_33%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
        <g id="Group">
          <path d={svgPaths.p206b5200} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[6.25%_6.44%_59.94%_59.75%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
        <g id="Group">
          <path d={svgPaths.p2d415700} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[6.25%_6.44%_59.94%_6.25%]" data-name="Group">
      <Group1 />
      <Group2 />
      <Group3 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute inset-[53.99%_34.3%_6.44%_34.12%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 7">
        <g id="Group">
          <path d={svgPaths.p3902ca00} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group96() {
  return (
    <div className="absolute contents inset-[6.25%_6.25%_6.44%_6.25%]">
      <Group />
      <Group4 />
      <Group5 />
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[6.25%_6.25%_6.44%_6.25%]" data-name="Group">
      <Group96 />
    </div>
  );
}

function Shop1() {
  return (
    <div className="absolute left-4 overflow-clip size-4 top-[183px]" data-name="shop 1">
      <Group6 />
    </div>
  );
}

function Group111() {
  return (
    <div className="absolute contents left-4 top-[181px]">
      <div className="absolute font-['Open_Sans:Regular',_sans-serif] font-normal leading-[0] text-[#000000] text-[14px] top-[181px] translate-x-[100%] w-[169px]" style={{ fontVariationSettings: "'wdth' 100", right: "calc(33.333% + 177.333px)" }}>
        <p className="leading-[normal]">Магазин Cvety.kz</p>
      </div>
      <Shop1 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute bottom-[6.25%] left-0 right-0 top-[6.25%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 14">
        <g id="Group">
          <path d={svgPaths.p297e0800} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p3c1a0300} fill="var(--fill-0, black)" id="Vector_2" />
          <path d={svgPaths.p27131f00} fill="var(--fill-0, black)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Filter41() {
  return (
    <div className="absolute overflow-clip size-4 top-[183px]" data-name="filter (4) 1" style={{ left: "calc(66.667% + 7.667px)" }}>
      <Group7 />
    </div>
  );
}

function Group94() {
  return (
    <div className="absolute contents top-[183px]" style={{ left: "calc(66.667% + 7.667px)" }}>
      <Filter41 />
    </div>
  );
}

function Group95() {
  return (
    <div className="absolute contents top-[181px]" style={{ left: "calc(66.667% + 7.667px)" }}>
      <div className="absolute font-['Open_Sans:Regular',_sans-serif] font-normal leading-[0] right-4 text-[#000000] text-[14px] text-nowrap text-right top-[181px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">Фильтры</p>
      </div>
      <Group94 />
    </div>
  );
}

function Group129() {
  return (
    <div className="absolute h-6 top-[333px] w-11" style={{ left: "calc(83.333% - 6.667px)" }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 24">
        <g id="Group 81">
          <rect fill="var(--fill-0, #0CB798)" height="24" id="Rectangle 4" rx="12" width="44" />
          <circle cx="32" cy="12" fill="var(--fill-0, white)" id="Ellipse 1" r="10" />
        </g>
      </svg>
    </div>
  );
}

function Group135() {
  return (
    <div className="absolute h-6 top-[437px] w-11" style={{ left: "calc(83.333% - 6.667px)" }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 24">
        <g id="Group 81">
          <rect fill="var(--fill-0, #0CB798)" height="24" id="Rectangle 4" rx="12" width="44" />
          <circle cx="32" cy="12" fill="var(--fill-0, white)" id="Ellipse 1" r="10" />
        </g>
      </svg>
    </div>
  );
}

function Group136() {
  return (
    <div className="absolute h-6 top-[541px] w-11" style={{ left: "calc(83.333% - 6.667px)" }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 24">
        <g id="Group 81">
          <rect fill="var(--fill-0, #0CB798)" height="24" id="Rectangle 4" rx="12" width="44" />
          <circle cx="32" cy="12" fill="var(--fill-0, white)" id="Ellipse 1" r="10" />
        </g>
      </svg>
    </div>
  );
}

function Group132() {
  return (
    <div className="absolute h-6 top-[645px] w-11" style={{ left: "calc(83.333% - 6.667px)" }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 24">
        <g id="Group 132">
          <rect fill="var(--fill-0, #6B6773)" height="24" id="Rectangle 7" rx="12" width="44" />
          <circle cx="12" cy="12" fill="var(--fill-0, white)" id="Ellipse 4" r="10" />
        </g>
      </svg>
    </div>
  );
}

function Group133() {
  return (
    <div className="absolute h-6 top-[749px] w-11" style={{ left: "calc(83.333% - 6.667px)" }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 24">
        <g id="Group 132">
          <rect fill="var(--fill-0, #6B6773)" height="24" id="Rectangle 7" rx="12" width="44" />
          <circle cx="12" cy="12" fill="var(--fill-0, white)" id="Ellipse 4" r="10" />
        </g>
      </svg>
    </div>
  );
}

function Group134() {
  return (
    <div className="absolute h-6 top-[853px] w-11" style={{ left: "calc(83.333% - 6.667px)" }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 24">
        <g id="Group 132">
          <rect fill="var(--fill-0, #6B6773)" height="24" id="Rectangle 7" rx="12" width="44" />
          <circle cx="12" cy="12" fill="var(--fill-0, white)" id="Ellipse 4" r="10" />
        </g>
      </svg>
    </div>
  );
}

function Group137() {
  return (
    <div className="absolute h-6 top-[957px] w-11" style={{ left: "calc(83.333% - 6.667px)" }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 24">
        <g id="Group 132">
          <rect fill="var(--fill-0, #6B6773)" height="24" id="Rectangle 7" rx="12" width="44" />
          <circle cx="12" cy="12" fill="var(--fill-0, white)" id="Ellipse 4" r="10" />
        </g>
      </svg>
    </div>
  );
}

function Group180() {
  return (
    <div className="absolute contents left-0 top-[507px]">
      <div className="absolute bg-[#c4c4c4] h-[61px] left-0 top-[507px] w-80" />
      <div className="absolute font-['Open_Sans:Regular',_sans-serif] font-normal leading-[0] text-[#000000] text-[20px] text-nowrap top-[523px]" style={{ fontVariationSettings: "'wdth' 100", left: "calc(33.333% + 14.333px)" }}>
        <p className="leading-[30px] whitespace-pre">НАВБАР</p>
      </div>
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-[#ffffff] relative size-full" data-name="Лента товаров">
      <div className="absolute flex h-[34px] items-center justify-center left-1/2 top-4 w-36">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="h-[34px] relative w-36" data-name="Segment">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 144 34">
              <path clipRule="evenodd" d={svgPaths.p2dbae3f0} fill="var(--fill-0, #8A49F3)" fillRule="evenodd" id="Segment" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute font-['Open_Sans:Regular',_sans-serif] font-normal leading-[0] left-4 text-[#000000] text-[24px] text-nowrap top-[70px]" style={{ right: "calc(66.667% + 1.667px)", fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">Товары</p>
      </div>
      <div className="absolute h-6 left-[87.5%] right-[5%] top-[74px]" data-name="Icon">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <path d={svgPaths.p2591fc00} fill="var(--fill-0, #9B51E0)" id="Icon" />
        </svg>
      </div>
      <Group80 />
      <div className="absolute font-['Open_Sans:Bold',_sans-serif] font-bold leading-[0] text-[#000000] text-[14px] top-[229px] translate-x-[100%] w-[132px]" style={{ right: "calc(16.667% + 150.667px)", fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Готовый товар</p>
      </div>
      <div className="absolute font-['Open_Sans:Regular',_'Noto_Sans:Regular',_sans-serif] font-normal leading-[0] text-[#000000] text-[14px] text-nowrap top-[253px] translate-x-[100%]" style={{ fontVariationSettings: "'wdth' 100", right: "calc(33.333% + 97.333px)" }}>
        <p className="leading-[normal] whitespace-pre">12 000 ₸</p>
      </div>
      <div className="absolute bg-center bg-cover bg-no-repeat h-[88px] left-4 top-[229px]" data-name="Rectangle" style={{ right: "calc(66.667% + 2.667px)", backgroundImage: `url('${imgRectangle}')` }} />
      <Group81 />
      <Group111 />
      <Group95 />
      <div className="absolute h-[34px] left-4 top-4 w-72" data-name="Container">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 288 34">
          <path d={svgPaths.p32bc4ff0} id="Container" stroke="var(--stroke-0, #8A49F3)" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal h-[18px] justify-center leading-[0] left-[88px] text-[#8a49f3] text-[14px] text-center top-[33px] translate-x-[-50%] translate-y-[-50%] w-36" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Товары</p>
      </div>
      <div className="absolute flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal h-[18px] justify-center leading-[0] text-[#ffffff] text-[14px] text-center top-[33px] translate-x-[-50%] translate-y-[-50%] w-36" style={{ left: "calc(50% + 72px)", fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Готовые товары</p>
      </div>
      <div className="absolute h-0 left-4 top-[325px] w-72">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 288 1">
            <line id="Line 22" stroke="var(--stroke-0, #E2E2E2)" x2="288" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute font-['Open_Sans:Bold',_sans-serif] font-bold leading-[0] text-[#000000] text-[14px] top-[333px] translate-x-[100%] w-[132px]" style={{ fontVariationSettings: "'wdth' 100", right: "calc(16.667% + 150.667px)" }}>
        <p className="leading-[normal]">Готовый товар</p>
      </div>
      <div className="absolute font-['Open_Sans:Regular',_'Noto_Sans:Regular',_sans-serif] font-normal leading-[0] text-[#000000] text-[14px] text-nowrap top-[357px] translate-x-[100%]" style={{ fontVariationSettings: "'wdth' 100", right: "calc(33.333% + 97.333px)" }}>
        <p className="leading-[normal] whitespace-pre">12 000 ₸</p>
      </div>
      <Group129 />
      <div className="absolute h-0 left-4 top-[429px] w-72">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 288 1">
            <line id="Line 22" stroke="var(--stroke-0, #E2E2E2)" x2="288" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-4 top-[221px] w-72">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 288 1">
            <line id="Line 22" stroke="var(--stroke-0, #E2E2E2)" x2="288" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute bg-center bg-cover bg-no-repeat h-[88px] left-4 top-[333px]" data-name="Rectangle" style={{ right: "calc(66.667% + 2.667px)", backgroundImage: `url('${imgRectangle1}')` }} />
      <div className="absolute font-['Open_Sans:Bold',_sans-serif] font-bold leading-[0] text-[#000000] text-[14px] top-[437px] translate-x-[100%] w-[132px]" style={{ fontVariationSettings: "'wdth' 100", right: "calc(16.667% + 150.667px)" }}>
        <p className="leading-[normal]">Готовый товар</p>
      </div>
      <div className="absolute font-['Open_Sans:Regular',_'Noto_Sans:Regular',_sans-serif] font-normal leading-[0] text-[#000000] text-[14px] text-nowrap top-[461px] translate-x-[100%]" style={{ fontVariationSettings: "'wdth' 100", right: "calc(33.333% + 97.333px)" }}>
        <p className="leading-[normal] whitespace-pre">12 000 ₸</p>
      </div>
      <div className="absolute bg-center bg-cover bg-no-repeat h-[88px] left-4 top-[437px]" data-name="Rectangle" style={{ backgroundImage: `url('${imgRectangle}')`, right: "calc(66.667% + 2.667px)" }} />
      <Group135 />
      <div className="absolute h-0 left-4 top-[533px] w-72">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 288 1">
            <line id="Line 22" stroke="var(--stroke-0, #E2E2E2)" x2="288" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute font-['Open_Sans:Bold',_sans-serif] font-bold leading-[0] text-[#000000] text-[14px] top-[541px] translate-x-[100%] w-[132px]" style={{ fontVariationSettings: "'wdth' 100", right: "calc(16.667% + 150.667px)" }}>
        <p className="leading-[normal]">Готовый товар</p>
      </div>
      <div className="absolute font-['Open_Sans:Regular',_'Noto_Sans:Regular',_sans-serif] font-normal leading-[0] text-[#000000] text-[14px] text-nowrap top-[565px] translate-x-[100%]" style={{ fontVariationSettings: "'wdth' 100", right: "calc(33.333% + 97.333px)" }}>
        <p className="leading-[normal] whitespace-pre">12 000 ₸</p>
      </div>
      <Group136 />
      <div className="absolute h-0 left-4 top-[637px] w-72">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 288 1">
            <line id="Line 22" stroke="var(--stroke-0, #E2E2E2)" x2="288" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute bg-center bg-cover bg-no-repeat h-[88px] left-4 top-[541px]" data-name="Rectangle" style={{ backgroundImage: `url('${imgRectangle1}')`, right: "calc(66.667% + 2.667px)" }} />
      <div className="absolute font-['Open_Sans:Bold',_sans-serif] font-bold leading-[0] text-[#6b6773] text-[14px] top-[645px] translate-x-[100%] w-[132px]" style={{ right: "calc(16.667% + 150.667px)", fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Готовый товар</p>
      </div>
      <div className="absolute font-['Open_Sans:Regular',_'Noto_Sans:Regular',_sans-serif] font-normal leading-[0] text-[#6b6773] text-[14px] text-nowrap top-[669px] translate-x-[100%]" style={{ fontVariationSettings: "'wdth' 100", right: "calc(33.333% + 97.333px)" }}>
        <p className="leading-[normal] whitespace-pre">12 000 ₸</p>
      </div>
      <div className="absolute bg-center bg-cover bg-no-repeat h-[88px] left-4 top-[645px]" data-name="Rectangle" style={{ backgroundImage: `url('${imgRectangle}')`, right: "calc(66.667% + 2.667px)" }} />
      <div className="absolute h-0 left-4 top-[741px] w-72">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 288 1">
            <line id="Line 22" stroke="var(--stroke-0, #E2E2E2)" x2="288" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute font-['Open_Sans:Bold',_sans-serif] font-bold leading-[0] text-[#6b6773] text-[14px] top-[749px] translate-x-[100%] w-[132px]" style={{ fontVariationSettings: "'wdth' 100", right: "calc(16.667% + 150.667px)" }}>
        <p className="leading-[normal]">Готовый товар</p>
      </div>
      <div className="absolute font-['Open_Sans:Regular',_'Noto_Sans:Regular',_sans-serif] font-normal leading-[0] text-[#6b6773] text-[14px] text-nowrap top-[773px] translate-x-[100%]" style={{ fontVariationSettings: "'wdth' 100", right: "calc(33.333% + 97.333px)" }}>
        <p className="leading-[normal] whitespace-pre">12 000 ₸</p>
      </div>
      <div className="absolute h-0 left-4 top-[845px] w-72">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 288 1">
            <line id="Line 22" stroke="var(--stroke-0, #E2E2E2)" x2="288" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute bg-center bg-cover bg-no-repeat h-[88px] left-4 top-[749px]" data-name="Rectangle" style={{ backgroundImage: `url('${imgRectangle1}')`, right: "calc(66.667% + 2.667px)" }} />
      <div className="absolute bg-[rgba(255,255,255,0.6)] h-[88px] left-4 top-[645px]" data-name="Rectangle" style={{ right: "calc(66.667% + 2.667px)" }} />
      <div className="absolute bg-[rgba(255,255,255,0.6)] h-[88px] left-4 top-[749px]" data-name="Rectangle" style={{ right: "calc(66.667% + 2.667px)" }} />
      <Group132 />
      <Group133 />
      <div className="absolute font-['Open_Sans:Bold',_sans-serif] font-bold leading-[0] text-[#6b6773] text-[14px] top-[853px] translate-x-[100%] w-[132px]" style={{ fontVariationSettings: "'wdth' 100", right: "calc(16.667% + 150.667px)" }}>
        <p className="leading-[normal]">Готовый товар</p>
      </div>
      <div className="absolute font-['Open_Sans:Regular',_'Noto_Sans:Regular',_sans-serif] font-normal leading-[0] text-[#6b6773] text-[14px] text-nowrap top-[877px] translate-x-[100%]" style={{ fontVariationSettings: "'wdth' 100", right: "calc(33.333% + 97.333px)" }}>
        <p className="leading-[normal] whitespace-pre">12 000 ₸</p>
      </div>
      <div className="absolute bg-center bg-cover bg-no-repeat h-[88px] left-4 top-[853px]" data-name="Rectangle" style={{ backgroundImage: `url('${imgRectangle}')`, right: "calc(66.667% + 2.667px)" }} />
      <div className="absolute h-0 left-4 top-[949px] w-72">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 288 1">
            <line id="Line 22" stroke="var(--stroke-0, #E2E2E2)" x2="288" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute font-['Open_Sans:Bold',_sans-serif] font-bold leading-[0] text-[#6b6773] text-[14px] top-[957px] translate-x-[100%] w-[132px]" style={{ fontVariationSettings: "'wdth' 100", right: "calc(16.667% + 150.667px)" }}>
        <p className="leading-[normal]">Готовый товар</p>
      </div>
      <div className="absolute font-['Open_Sans:Regular',_'Noto_Sans:Regular',_sans-serif] font-normal leading-[0] text-[#6b6773] text-[14px] text-nowrap top-[981px] translate-x-[100%]" style={{ fontVariationSettings: "'wdth' 100", right: "calc(33.333% + 97.333px)" }}>
        <p className="leading-[normal] whitespace-pre">12 000 ₸</p>
      </div>
      <div className="absolute h-0 left-4 top-[1053px] w-72">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 288 1">
            <line id="Line 22" stroke="var(--stroke-0, #E2E2E2)" x2="288" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute bg-center bg-cover bg-no-repeat h-[88px] left-4 top-[957px]" data-name="Rectangle" style={{ backgroundImage: `url('${imgRectangle1}')`, right: "calc(66.667% + 2.667px)" }} />
      <div className="absolute bg-[rgba(255,255,255,0.6)] h-[88px] left-4 top-[853px]" data-name="Rectangle" style={{ right: "calc(66.667% + 2.667px)" }} />
      <div className="absolute bg-[rgba(255,255,255,0.6)] h-[88px] left-4 top-[957px]" data-name="Rectangle" style={{ right: "calc(66.667% + 2.667px)" }} />
      <Group134 />
      <Group137 />
      <Group180 />
    </div>
  );
}