if(!self.define){let e,s={};const a=(a,i)=>(a=new URL(a+".js",i).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(i,r)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let n={};const o=e=>a(e,c),d={module:{uri:c},exports:n,require:o};s[c]=Promise.all(i.map((e=>d[e]||o(e)))).then((e=>(r(...e),n)))}}define(["./workbox-07a7b4f2"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/COKSg1PVaFRkc48lzXBd0/_buildManifest.js",revision:"d197326000ca1e881e7d1624371887df"},{url:"/_next/static/COKSg1PVaFRkc48lzXBd0/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/0b7b90cd.b5852e5e503d071d.js",revision:"b5852e5e503d071d"},{url:"/_next/static/chunks/1241-ec14d65470ca1dfd.js",revision:"ec14d65470ca1dfd"},{url:"/_next/static/chunks/1265-7fa0a4061c84528a.js",revision:"7fa0a4061c84528a"},{url:"/_next/static/chunks/1364-3140f908b99e3909.js",revision:"3140f908b99e3909"},{url:"/_next/static/chunks/1733-f1db3617a4ac267b.js",revision:"f1db3617a4ac267b"},{url:"/_next/static/chunks/1940-ea25e4548fa6158c.js",revision:"ea25e4548fa6158c"},{url:"/_next/static/chunks/2209-3e799779b6b0ab54.js",revision:"3e799779b6b0ab54"},{url:"/_next/static/chunks/2494-80c5e593c4fe9549.js",revision:"80c5e593c4fe9549"},{url:"/_next/static/chunks/2525.02c186a1774d2c93.js",revision:"02c186a1774d2c93"},{url:"/_next/static/chunks/2558-e04412624b331938.js",revision:"e04412624b331938"},{url:"/_next/static/chunks/2579-def26b618a78881b.js",revision:"def26b618a78881b"},{url:"/_next/static/chunks/2850-edce23829f3cee6f.js",revision:"edce23829f3cee6f"},{url:"/_next/static/chunks/3061-be08a466aa96bfbf.js",revision:"be08a466aa96bfbf"},{url:"/_next/static/chunks/330-66066aefa0270dc2.js",revision:"66066aefa0270dc2"},{url:"/_next/static/chunks/3856-3faf6ec834e652d9.js",revision:"3faf6ec834e652d9"},{url:"/_next/static/chunks/4611-cda6ac19e2b11df3.js",revision:"cda6ac19e2b11df3"},{url:"/_next/static/chunks/475-153c9775bcf2e7c4.js",revision:"153c9775bcf2e7c4"},{url:"/_next/static/chunks/4754-42d0cd4d37d0094d.js",revision:"42d0cd4d37d0094d"},{url:"/_next/static/chunks/4914-824c02c0b16e5239.js",revision:"824c02c0b16e5239"},{url:"/_next/static/chunks/4952-1f3bf6e334f626fe.js",revision:"1f3bf6e334f626fe"},{url:"/_next/static/chunks/5121-cbbc8061752d8c3a.js",revision:"cbbc8061752d8c3a"},{url:"/_next/static/chunks/5c8e84aa-e81bdbf81c779c71.js",revision:"e81bdbf81c779c71"},{url:"/_next/static/chunks/6025-3286d6701c3159b5.js",revision:"3286d6701c3159b5"},{url:"/_next/static/chunks/6360-ffc12d9b466c7b05.js",revision:"ffc12d9b466c7b05"},{url:"/_next/static/chunks/6547-06e5fed3be8c4cfd.js",revision:"06e5fed3be8c4cfd"},{url:"/_next/static/chunks/6957-f273c714fea787ae.js",revision:"f273c714fea787ae"},{url:"/_next/static/chunks/7068-7cfda97dccc3627c.js",revision:"7cfda97dccc3627c"},{url:"/_next/static/chunks/7215-86e0ebd249a0aa97.js",revision:"86e0ebd249a0aa97"},{url:"/_next/static/chunks/7454.0a1b5fc232b3bb40.js",revision:"0a1b5fc232b3bb40"},{url:"/_next/static/chunks/7499.e0e9df4d876c7d5d.js",revision:"e0e9df4d876c7d5d"},{url:"/_next/static/chunks/7510-8fb5bd1165219398.js",revision:"8fb5bd1165219398"},{url:"/_next/static/chunks/7535-62c2d75b9330acad.js",revision:"62c2d75b9330acad"},{url:"/_next/static/chunks/75fc9c18-a81e26132e35a072.js",revision:"a81e26132e35a072"},{url:"/_next/static/chunks/7607-a81eba15849c27c2.js",revision:"a81eba15849c27c2"},{url:"/_next/static/chunks/7d0bf13e-cf321b157ba52dce.js",revision:"cf321b157ba52dce"},{url:"/_next/static/chunks/8002.7a3e0d4651c35680.js",revision:"7a3e0d4651c35680"},{url:"/_next/static/chunks/8433-4c04ebe5f55b41f4.js",revision:"4c04ebe5f55b41f4"},{url:"/_next/static/chunks/847-9409a58195c5c4b6.js",revision:"9409a58195c5c4b6"},{url:"/_next/static/chunks/877-19ea342aae67aebf.js",revision:"19ea342aae67aebf"},{url:"/_next/static/chunks/8823-a5eff19981db35e9.js",revision:"a5eff19981db35e9"},{url:"/_next/static/chunks/9644-185e7aa592e2228d.js",revision:"185e7aa592e2228d"},{url:"/_next/static/chunks/9645-852521813b78b561.js",revision:"852521813b78b561"},{url:"/_next/static/chunks/9647-2397198cd606cb4f.js",revision:"2397198cd606cb4f"},{url:"/_next/static/chunks/9936.5c1633858cf4711f.js",revision:"5c1633858cf4711f"},{url:"/_next/static/chunks/ee9ce975-6b4f074965f13710.js",revision:"6b4f074965f13710"},{url:"/_next/static/chunks/fec483df-2f265b31c9e0101f.js",revision:"2f265b31c9e0101f"},{url:"/_next/static/chunks/framework-918963c1d31953b8.js",revision:"918963c1d31953b8"},{url:"/_next/static/chunks/main-5d5d21803313d06c.js",revision:"5d5d21803313d06c"},{url:"/_next/static/chunks/pages/404-3cfa2211160942e2.js",revision:"3cfa2211160942e2"},{url:"/_next/static/chunks/pages/_app-aafed57c3cd74d02.js",revision:"aafed57c3cd74d02"},{url:"/_next/static/chunks/pages/_error-e4216aab802f5810.js",revision:"e4216aab802f5810"},{url:"/_next/static/chunks/pages/about-us-284c9793ecf43305.js",revision:"284c9793ecf43305"},{url:"/_next/static/chunks/pages/admin-82253e877338628f.js",revision:"82253e877338628f"},{url:"/_next/static/chunks/pages/admin/shops-a550e741819dbe45.js",revision:"a550e741819dbe45"},{url:"/_next/static/chunks/pages/admin/shops/%5BshopId%5D-657cfcef38d28d02.js",revision:"657cfcef38d28d02"},{url:"/_next/static/chunks/pages/admin/surveys-ff367a4af23cd5a5.js",revision:"ff367a4af23cd5a5"},{url:"/_next/static/chunks/pages/admin/surveys/%5BsurveyId%5D-cf8ad4aa60fd35fe.js",revision:"cf8ad4aa60fd35fe"},{url:"/_next/static/chunks/pages/admin/users-25f6b5448d1efe40.js",revision:"25f6b5448d1efe40"},{url:"/_next/static/chunks/pages/admin/users/%5BuserId%5D-69ddfb4ee6b2160c.js",revision:"69ddfb4ee6b2160c"},{url:"/_next/static/chunks/pages/forum-bb59c7f1257862de.js",revision:"bb59c7f1257862de"},{url:"/_next/static/chunks/pages/forum/new-03807b08c5a7ae20.js",revision:"03807b08c5a7ae20"},{url:"/_next/static/chunks/pages/forum/post/%5Bid%5D-486212fc358d92f6.js",revision:"486212fc358d92f6"},{url:"/_next/static/chunks/pages/forum/post/%5Bid%5D/edit-1582bad2ba577253.js",revision:"1582bad2ba577253"},{url:"/_next/static/chunks/pages/forum/profile/%5BuserId%5D-ab626f5c0615f453.js",revision:"ab626f5c0615f453"},{url:"/_next/static/chunks/pages/index-328798bc7587b021.js",revision:"328798bc7587b021"},{url:"/_next/static/chunks/pages/legal-d17b03dc7fb6f005.js",revision:"d17b03dc7fb6f005"},{url:"/_next/static/chunks/pages/legal/collective-agreement-a56ed07cee1a838d.js",revision:"a56ed07cee1a838d"},{url:"/_next/static/chunks/pages/legal/cookies-4bb718ed257d68f2.js",revision:"4bb718ed257d68f2"},{url:"/_next/static/chunks/pages/legal/help-center-983c677dab9790be.js",revision:"983c677dab9790be"},{url:"/_next/static/chunks/pages/legal/privacy-716cde212f69c0af.js",revision:"716cde212f69c0af"},{url:"/_next/static/chunks/pages/legal/terms-of-use-63a065827443eac8.js",revision:"63a065827443eac8"},{url:"/_next/static/chunks/pages/onboarding-66769d754f1d804b.js",revision:"66769d754f1d804b"},{url:"/_next/static/chunks/pages/password-protect-7e05866c0e2aa89a.js",revision:"7e05866c0e2aa89a"},{url:"/_next/static/chunks/pages/products-9a944f3c935c4342.js",revision:"9a944f3c935c4342"},{url:"/_next/static/chunks/pages/profile-cf2a88e124b79285.js",revision:"cf2a88e124b79285"},{url:"/_next/static/chunks/pages/profile/shop-2214e76c524ae813.js",revision:"2214e76c524ae813"},{url:"/_next/static/chunks/pages/profile/shop/%5BshopId%5D-7d5575fdd8be1b8b.js",revision:"7d5575fdd8be1b8b"},{url:"/_next/static/chunks/pages/profile/survey-652ba983ac1d9860.js",revision:"652ba983ac1d9860"},{url:"/_next/static/chunks/pages/profile/tool-data-71788ce166bc4a36.js",revision:"71788ce166bc4a36"},{url:"/_next/static/chunks/pages/protected-81297ce23c6bb208.js",revision:"81297ce23c6bb208"},{url:"/_next/static/chunks/pages/shops-acefa8478b96bc68.js",revision:"acefa8478b96bc68"},{url:"/_next/static/chunks/pages/shops/%5BshopId%5D-5902cc5e57b51380.js",revision:"5902cc5e57b51380"},{url:"/_next/static/chunks/pages/sign-in/%5B%5B...index%5D%5D-9a09926343178c21.js",revision:"9a09926343178c21"},{url:"/_next/static/chunks/pages/sign-up/%5B%5B...index%5D%5D-67cd69b0c3a1c608.js",revision:"67cd69b0c3a1c608"},{url:"/_next/static/chunks/pages/tools-37ec91f66c7a85e7.js",revision:"37ec91f66c7a85e7"},{url:"/_next/static/chunks/pages/tools/sankofa-sizer-2d4166f89967d3fe.js",revision:"2d4166f89967d3fe"},{url:"/_next/static/chunks/pages/tools/shop-rate-calculator-9eb43fd9e14c8ee1.js",revision:"9eb43fd9e14c8ee1"},{url:"/_next/static/chunks/pages/tools/solidarity-pathways-7104c3d3d168e4c0.js",revision:"7104c3d3d168e4c0"},{url:"/_next/static/chunks/pages/tools/solidarity-pathways/%5BdepotId%5D-f49ec007bdc172ce.js",revision:"f49ec007bdc172ce"},{url:"/_next/static/chunks/pages/tools/solidarity-pathways/%5BdepotId%5D/overview-d45f5b1998f6cbd5.js",revision:"d45f5b1998f6cbd5"},{url:"/_next/static/chunks/pages/tools/solidarity-pathways/%5BdepotId%5D/route/%5BrouteId%5D-98831816945d4314.js",revision:"98831816945d4314"},{url:"/_next/static/chunks/pages/tools/solidarity-pathways/%5BdepotId%5D/route/%5BrouteId%5D/path/%5BpathId%5D-d1e4cf4b46faea13.js",revision:"d1e4cf4b46faea13"},{url:"/_next/static/chunks/pages/tools/solidarity-pathways/sandbox-71b6f783686c499e.js",revision:"71b6f783686c499e"},{url:"/_next/static/chunks/pages/unauthorized-4fae8853a388a9a7.js",revision:"4fae8853a388a9a7"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-587f1f22ce0b5392.js",revision:"587f1f22ce0b5392"},{url:"/_next/static/css/4314e8304b779cbf.css",revision:"4314e8304b779cbf"},{url:"/_next/static/css/7f4f99a8fcc96418.css",revision:"7f4f99a8fcc96418"},{url:"/_next/static/media/layers-2x.9859cd12.png",revision:"9859cd12"},{url:"/_next/static/media/layers.ef6db872.png",revision:"ef6db872"},{url:"/_next/static/media/marker-icon.d577052a.png",revision:"d577052a"},{url:"/android/android-launchericon-144-144.png",revision:"f9e8dc46972f6f0542a84284e66dc230"},{url:"/android/android-launchericon-192-192.png",revision:"a2390ca4e4bcce6315c2c6ede12e2068"},{url:"/android/android-launchericon-48-48.png",revision:"9069e23b7ac0cd92d1128e9fb2c5c399"},{url:"/android/android-launchericon-512-512.png",revision:"520a61797e5180f52e47b9090ce0e931"},{url:"/android/android-launchericon-72-72.png",revision:"fbec55933805959673ed9132ff83e8e9"},{url:"/android/android-launchericon-96-96.png",revision:"1e9d18f1c2cb9e19f173bb07f6909171"},{url:"/auth.svg",revision:"266ab07b359052c6204b869164fe4551"},{url:"/diaogram.png",revision:"9b9c5661f0bcf793fde7f018f355664f"},{url:"/drivers.csv",revision:"01d177832c7c96e39b5144dbd2213292"},{url:"/favicon.ico",revision:"f3c25005ddbc164f60f31b5aeb413ce5"},{url:"/icons.json",revision:"5dbbc3fe59816e65ba28e355a58ea45c"},{url:"/img/AF montage.png",revision:"b862ca41ae203e97c1d9ba125b3c7747"},{url:"/img/ai_cloth.png",revision:"986d9c24c5f7ceaf7653052866fdc7a4"},{url:"/img/ankle.svg",revision:"6868b3836f020e15ca5557ccc6d75ca2"},{url:"/img/auth0-dark.svg",revision:"3bb00cd200e7b5918f81ed7135b54ac6"},{url:"/img/auth0.svg",revision:"cdc78c99a51c901e56551883129c4b08"},{url:"/img/background-fallback.jpg",revision:"2ebe561d1dd102244ac32c303d228d9a"},{url:"/img/biceps.svg",revision:"eab4c4563abdfd4e1553416f8af16c58"},{url:"/img/blank.svg",revision:"14af37e8ebf0a69126118bfa1a2cbbc9"},{url:"/img/craft_composition.png",revision:"de76c46119d3a6c7206720969db98539"},{url:"/img/demo/cover_dabls.jpg",revision:"befe775f930aa4772f0ef41c39dfe053"},{url:"/img/demo/profile_dabls.jpg",revision:"ca9ad3334062e0c7276388c71f39a109"},{url:"/img/discord.svg",revision:"2f63e451db6c5d8829407a7f1c395253"},{url:"/img/dribbble-dark.svg",revision:"dc59a7048387c97c6d5fc0101ada4565"},{url:"/img/flowchart.png",revision:"feb7d16e9aa768914d5db2f405b4b9e6"},{url:"/img/github.svg",revision:"56c8c35c5994e96146c87a55b43c582f"},{url:"/img/gitlab-dark.svg",revision:"7069249f57e1f9a23f3ff9883ca989ba"},{url:"/img/google.svg",revision:"769d19241f070274c1dd79c0a8c730a8"},{url:"/img/hero.jpg",revision:"b6690470835e6e7944cc47fcde176b9f"},{url:"/img/inseam.svg",revision:"fa9a77a4afc56248d70649f503955741"},{url:"/img/knee.svg",revision:"4aa6b68b90fd1072bf02bcc0c4368cf2"},{url:"/img/logo.png",revision:"177565b6cf831b782109b42383a5f333"},{url:"/img/logo_mobile.png",revision:"63b5dd1705f67f298a4dc73caae7ff21"},{url:"/img/lost.svg",revision:"f3df32d843fc7381f350b33f4b49f2cd"},{url:"/img/montage1.png",revision:"076a2c95d0d7e5d15fa10dff3048397b"},{url:"/img/montage2.png",revision:"b795b6791d0ad942d1bffb5811c721bd"},{url:"/img/montage3.png",revision:"4f0aa819e627dfc4501ae0c15294a0a7"},{url:"/img/montage4.png",revision:"db9f2566d50be0fb6f755bfc282f1f52"},{url:"/img/montage5.png",revision:"2a875e60dcdda8aa609159596f26c150"},{url:"/img/nst_a.png",revision:"c4d244f3e9c8f1cdd1acb7f71f10b89c"},{url:"/img/nst_b.png",revision:"6ac5a18df0f8850c1fcb781856b4852a"},{url:"/img/nst_c.png",revision:"e5173f6bd965888e0dcf6865906f92eb"},{url:"/img/popup.jpg",revision:"18acbcfcb022d3aa47af7cd181974025"},{url:"/img/route_optimization.png",revision:"f60fbd9a9df450239cff93603e2033b4"},{url:"/img/routing.png",revision:"5fb4e44fcf6baf0791dfc198735ce096"},{url:"/img/sankofa-sizer-demo.jpg",revision:"722e3cd7cac2c0579e6c2c68026c4586"},{url:"/img/seat_back.svg",revision:"403223ff18564ea1bc6eb9c6b285f827"},{url:"/img/shop_rate.png",revision:"1b5d25f02cdf6af87191f56014d91ec4"},{url:"/img/shoprate.png",revision:"80bc0d75538acac7e09f7690cf2845a8"},{url:"/img/shoulder_to_wrist.svg",revision:"cdff5d2b6e367b291d52066ccf954ec5"},{url:"/img/style_transfer/beach.jpg",revision:"c21c5f04f96c8a06dfb3092a96fb3f4b"},{url:"/img/style_transfer/bricks.jpg",revision:"a13dacc5ef30092ce9872c3471cc26c7"},{url:"/img/style_transfer/chicago.jpg",revision:"8262bbf4546363eee19ee4f9c5cbcf14"},{url:"/img/style_transfer/clouds.jpg",revision:"6539997a656a4f224b77f0d812b71b82"},{url:"/img/style_transfer/diana.jpg",revision:"916912125855b83acdc3ccbf04ab9d14"},{url:"/img/style_transfer/golden_gate.jpg",revision:"531565534b6f3d690f2be43ce51d83c2"},{url:"/img/style_transfer/red_circles.jpg",revision:"60cd4da86a7ff1fd76e8e6f7cf968d97"},{url:"/img/style_transfer/seaport.jpg",revision:"99850e33f60db644dd1fbaeae44d407f"},{url:"/img/style_transfer/sketch.jpg",revision:"e8775eee466b9866e2851f96bcec1ce4"},{url:"/img/style_transfer/stata.jpg",revision:"81a86fa5e8adca9a8ad1f4d6d449f1d2"},{url:"/img/style_transfer/statue_of_liberty.jpg",revision:"b13b6dee513b7fb49ff620bd2e86f211"},{url:"/img/style_transfer/stripes.jpg",revision:"f6c02290f4dce29b8d29a50132fb3c28"},{url:"/img/style_transfer/towers.jpg",revision:"2443f87f95564e401f3eab938da84a49"},{url:"/img/style_transfer/udnie.jpg",revision:"a35587cfdc24e867e3c1dd270d96ac17"},{url:"/img/style_transfer/zigzag.jpg",revision:"63af32f948f09d7c70ef6d9305534c05"},{url:"/img/wrist.svg",revision:"84cdf1fe1bbc2a68573569d7ba61ec68"},{url:"/ios/100.png",revision:"2e7f40e526b0cdf2ae4a294bd0c3ea8b"},{url:"/ios/1024.png",revision:"b7b81fed4bb07782c637e7a15ad88d1f"},{url:"/ios/114.png",revision:"2b56e9e98a50a4f1e9d864a5c70b7966"},{url:"/ios/120.png",revision:"2d1b8bd11ad51f4c2bbb162b0552da54"},{url:"/ios/128.png",revision:"210acb2b5a3556e172bcb39da98eff3c"},{url:"/ios/144.png",revision:"f9e8dc46972f6f0542a84284e66dc230"},{url:"/ios/152.png",revision:"e9e54bd226077c896d191352341d573c"},{url:"/ios/16.png",revision:"2ccaafef96d9acdee591258139b50325"},{url:"/ios/167.png",revision:"07335bd1872a1e18288eccd278934b26"},{url:"/ios/180.png",revision:"3e3ef3a24e8d24e99608ee0bb6ef4c7e"},{url:"/ios/192.png",revision:"a2390ca4e4bcce6315c2c6ede12e2068"},{url:"/ios/20.png",revision:"bd41d57db84bf1e53a5733e56c9ad385"},{url:"/ios/256.png",revision:"54876eb117aaf0e01daeb69c9b505816"},{url:"/ios/29.png",revision:"c4b8e2348595f6c5c49b26680f734be0"},{url:"/ios/32.png",revision:"5c5ff93e6f6443e44da0d08693dc05b2"},{url:"/ios/40.png",revision:"85a6eee0b88c1e4e41f324f0cd1c63ff"},{url:"/ios/50.png",revision:"08a469f9129e6aa0facce46d8f60eb0c"},{url:"/ios/512.png",revision:"520a61797e5180f52e47b9090ce0e931"},{url:"/ios/57.png",revision:"44de3c93a4b1401586bdf80c193ed1f0"},{url:"/ios/58.png",revision:"f35b28ab365f55e8e0290df5d504870b"},{url:"/ios/60.png",revision:"541dcef62859bcc25b67e712ca0f2b5e"},{url:"/ios/64.png",revision:"e43b7b00ac7349ed60dc00d4770f472e"},{url:"/ios/72.png",revision:"fbec55933805959673ed9132ff83e8e9"},{url:"/ios/76.png",revision:"65ad5cf08c8a9e4daff44dd58b271fd1"},{url:"/ios/80.png",revision:"257c6144b837020722ea68a34c05d28b"},{url:"/ios/87.png",revision:"70815ff4c5c387006d1d359b6b8e8514"},{url:"/manifest.json",revision:"dff2248d239e9e1db8ad876636f7b842"},{url:"/marker-icon.png",revision:"2273e3d8ad9264b7daa5bdbf8e6b47f8"},{url:"/marker.svg",revision:"798e74b7679d51ec754c330e12a6c692"},{url:"/pancakes.svg",revision:"718a1efad0747515969ceea1f0d07037"},{url:"/sign-in.svg",revision:"40bc278ed96fe51ccded0d4fdf2efd34"},{url:"/sign-up.svg",revision:"b30a731905bbbd128370329c520d4775"},{url:"/stops.csv",revision:"1b9c4eeb6834f29a11d54269bc4e389d"},{url:"/style-transfer/saved_model_style_inception_js/group1-shard1of9",revision:"cf98a53d98288a92e6068a185d44e645"},{url:"/style-transfer/saved_model_style_inception_js/group1-shard1of9:Zone.Identifier",revision:"cae647e59a2546339c3ac850890482ac"},{url:"/style-transfer/saved_model_style_inception_js/group1-shard2of9",revision:"2808b2cb9166526c187e753b2f203970"},{url:"/style-transfer/saved_model_style_inception_js/group1-shard2of9:Zone.Identifier",revision:"cae647e59a2546339c3ac850890482ac"},{url:"/style-transfer/saved_model_style_inception_js/group1-shard3of9",revision:"d715426a83b067670e866cf87250960a"},{url:"/style-transfer/saved_model_style_inception_js/group1-shard3of9:Zone.Identifier",revision:"cae647e59a2546339c3ac850890482ac"},{url:"/style-transfer/saved_model_style_inception_js/group1-shard4of9",revision:"ae673b54b7831c3f627bac114a52ff92"},{url:"/style-transfer/saved_model_style_inception_js/group1-shard4of9:Zone.Identifier",revision:"cae647e59a2546339c3ac850890482ac"},{url:"/style-transfer/saved_model_style_inception_js/group1-shard5of9",revision:"e437786d4ec410ead22d18bad8cc6dd0"},{url:"/style-transfer/saved_model_style_inception_js/group1-shard5of9:Zone.Identifier",revision:"cae647e59a2546339c3ac850890482ac"},{url:"/style-transfer/saved_model_style_inception_js/group1-shard6of9",revision:"d022b62f3079345f90f0e2189434a2fe"},{url:"/style-transfer/saved_model_style_inception_js/group1-shard6of9:Zone.Identifier",revision:"cae647e59a2546339c3ac850890482ac"},{url:"/style-transfer/saved_model_style_inception_js/group1-shard7of9",revision:"fb590e25e290dbe043a6982ecf0a3945"},{url:"/style-transfer/saved_model_style_inception_js/group1-shard7of9:Zone.Identifier",revision:"cae647e59a2546339c3ac850890482ac"},{url:"/style-transfer/saved_model_style_inception_js/group1-shard8of9",revision:"b7692e88ab0ecd2388ef4226bbfc8e4d"},{url:"/style-transfer/saved_model_style_inception_js/group1-shard8of9:Zone.Identifier",revision:"cae647e59a2546339c3ac850890482ac"},{url:"/style-transfer/saved_model_style_inception_js/group1-shard9of9",revision:"412f52ee5397906dd62d7a4ff92e0d56"},{url:"/style-transfer/saved_model_style_inception_js/group1-shard9of9:Zone.Identifier",revision:"cae647e59a2546339c3ac850890482ac"},{url:"/style-transfer/saved_model_style_inception_js/model.json",revision:"60389d1331c6009c98d26af1bfec8235"},{url:"/style-transfer/saved_model_style_inception_js/model.json:Zone.Identifier",revision:"cae647e59a2546339c3ac850890482ac"},{url:"/style-transfer/saved_model_style_js/group1-shard1of3",revision:"d19e4407dbada619d70340a780e4adab"},{url:"/style-transfer/saved_model_style_js/group1-shard1of3:Zone.Identifier",revision:"cae647e59a2546339c3ac850890482ac"},{url:"/style-transfer/saved_model_style_js/group1-shard2of3",revision:"8eba84bf2ab278b680ba890281acb5f3"},{url:"/style-transfer/saved_model_style_js/group1-shard2of3:Zone.Identifier",revision:"cae647e59a2546339c3ac850890482ac"},{url:"/style-transfer/saved_model_style_js/group1-shard3of3",revision:"b54c8de769326f16d4d6fad1b699f54d"},{url:"/style-transfer/saved_model_style_js/group1-shard3of3:Zone.Identifier",revision:"cae647e59a2546339c3ac850890482ac"},{url:"/style-transfer/saved_model_style_js/model.json",revision:"55260193f30e182058ac058f0464d246"},{url:"/style-transfer/saved_model_style_js/model.json:Zone.Identifier",revision:"cae647e59a2546339c3ac850890482ac"},{url:"/style-transfer/saved_model_transformer_js/group1-shard1of2",revision:"46117db10695c3e643ebda556502d310"},{url:"/style-transfer/saved_model_transformer_js/group1-shard1of2:Zone.Identifier",revision:"cae647e59a2546339c3ac850890482ac"},{url:"/style-transfer/saved_model_transformer_js/group1-shard2of2",revision:"a2c002514aaa9ae126fbbc8ede03640b"},{url:"/style-transfer/saved_model_transformer_js/group1-shard2of2:Zone.Identifier",revision:"cae647e59a2546339c3ac850890482ac"},{url:"/style-transfer/saved_model_transformer_js/model.json",revision:"f50539e424da699a803e29be90219ff7"},{url:"/style-transfer/saved_model_transformer_js/model.json:Zone.Identifier",revision:"cae647e59a2546339c3ac850890482ac"},{url:"/style-transfer/saved_model_transformer_separable_js/group1-shard1of1",revision:"d1d0ec554ff671d32cbd6e46a6455270"},{url:"/style-transfer/saved_model_transformer_separable_js/group1-shard1of1:Zone.Identifier",revision:"cae647e59a2546339c3ac850890482ac"},{url:"/style-transfer/saved_model_transformer_separable_js/model.json",revision:"fffc1f0b38cf73a0c9594059b60dec08"},{url:"/style-transfer/saved_model_transformer_separable_js/model.json:Zone.Identifier",revision:"cae647e59a2546339c3ac850890482ac"},{url:"/three-dot.svg",revision:"7a2e6602d48110a142869499ffb37b1f"},{url:"/three-dot.svg:Zone.Identifier",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"/welcome.svg",revision:"c84c6021e6c3f62dc2e8656b9c8eaf94"},{url:"/windows11/LargeTile.scale-100.png",revision:"7008f4f32a18fe1d7eae8d786cc6c78f"},{url:"/windows11/LargeTile.scale-125.png",revision:"c27a57071cf60641f30b43af07a7cd11"},{url:"/windows11/LargeTile.scale-150.png",revision:"800041d81c9c9459fda8efbec8cc736a"},{url:"/windows11/LargeTile.scale-200.png",revision:"119fdf0d362252bd80a6b9b9d9669768"},{url:"/windows11/LargeTile.scale-400.png",revision:"92dbbffa60cddefef2a203b9fbc04bc5"},{url:"/windows11/SmallTile.scale-100.png",revision:"925d7f4bcb761ef6a7afcda3745876ab"},{url:"/windows11/SmallTile.scale-125.png",revision:"943364805889fc51b6fdd1b8e4595903"},{url:"/windows11/SmallTile.scale-150.png",revision:"f6e29dd5ddbe650653bc767557dd1dbd"},{url:"/windows11/SmallTile.scale-200.png",revision:"d92f50fed7871cb8a65d3b1f18dcaec8"},{url:"/windows11/SmallTile.scale-400.png",revision:"260b20f5c0b6b4cff9275c51d8ab9e31"},{url:"/windows11/SplashScreen.scale-100.png",revision:"2a4130daab547a40a0945982d154b962"},{url:"/windows11/SplashScreen.scale-125.png",revision:"6f53d2e8eead0d7e266a6487bf43ba13"},{url:"/windows11/SplashScreen.scale-150.png",revision:"b1ad34e02a97a8b3673c024429a6ae74"},{url:"/windows11/SplashScreen.scale-200.png",revision:"ad504430e0c600a913c82cc33c0ef0ed"},{url:"/windows11/SplashScreen.scale-400.png",revision:"635b4b09e0c1b3e19e44a310adb86839"},{url:"/windows11/Square150x150Logo.scale-100.png",revision:"628847c69fe530b06e39c38e431fc020"},{url:"/windows11/Square150x150Logo.scale-125.png",revision:"3dea104a523b0f6cb258e4e941933efb"},{url:"/windows11/Square150x150Logo.scale-150.png",revision:"79b6a9596290d87d9bc0411e24a3a101"},{url:"/windows11/Square150x150Logo.scale-200.png",revision:"4b2ba19bae2c8de675c49dbc9dd886b6"},{url:"/windows11/Square150x150Logo.scale-400.png",revision:"6784f11ceed2815ce9c65c449b717d3d"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png",revision:"69c20833e5352d5c0714a435294455b0"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png",revision:"4c7fe4b8ba024a26bf0835a62c734633"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png",revision:"9d021ecb4b0808dcf54356fa3676af9d"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png",revision:"3396cba7779f6fb21ac9bab7d674b7ca"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png",revision:"6b840a45dcdd3a36b47bcb50536a3d7d"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png",revision:"dff9b12461c22267c2ddd46737273117"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png",revision:"36031e02e303bbd4f5c0c21eadd7fd16"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png",revision:"990c1e847ab7f81e2d533a246d9f4878"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png",revision:"b8f453529990238789f02f69dc043008"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png",revision:"228bb2fe714542cc501f7b4d83cf8ef2"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png",revision:"f1ad0bb67613b4aabe5ac58404be1248"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png",revision:"f0042cf341175a3d519c2309b04e5c70"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png",revision:"4f592a70c7158effca334d5e1fee6ad1"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png",revision:"f9cb4a8f8d6c30ad3ed4263c83c3d287"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png",revision:"048eaddf2c490e494c91949fac570531"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-16.png",revision:"69c20833e5352d5c0714a435294455b0"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-20.png",revision:"4c7fe4b8ba024a26bf0835a62c734633"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-24.png",revision:"9d021ecb4b0808dcf54356fa3676af9d"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-256.png",revision:"3396cba7779f6fb21ac9bab7d674b7ca"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-30.png",revision:"6b840a45dcdd3a36b47bcb50536a3d7d"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-32.png",revision:"dff9b12461c22267c2ddd46737273117"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-36.png",revision:"36031e02e303bbd4f5c0c21eadd7fd16"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-40.png",revision:"990c1e847ab7f81e2d533a246d9f4878"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-44.png",revision:"b8f453529990238789f02f69dc043008"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-48.png",revision:"228bb2fe714542cc501f7b4d83cf8ef2"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-60.png",revision:"f1ad0bb67613b4aabe5ac58404be1248"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-64.png",revision:"f0042cf341175a3d519c2309b04e5c70"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-72.png",revision:"4f592a70c7158effca334d5e1fee6ad1"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-80.png",revision:"f9cb4a8f8d6c30ad3ed4263c83c3d287"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-96.png",revision:"048eaddf2c490e494c91949fac570531"},{url:"/windows11/Square44x44Logo.scale-100.png",revision:"b8f453529990238789f02f69dc043008"},{url:"/windows11/Square44x44Logo.scale-125.png",revision:"c34d0f9341d5358e7a98b61570375224"},{url:"/windows11/Square44x44Logo.scale-150.png",revision:"cb910145a1c52c7c3fed26511c724776"},{url:"/windows11/Square44x44Logo.scale-200.png",revision:"f19ef4c4441759bf36161c8f30e9409a"},{url:"/windows11/Square44x44Logo.scale-400.png",revision:"f50543e0750926cdccaabdadf7bf0ad3"},{url:"/windows11/Square44x44Logo.targetsize-16.png",revision:"69c20833e5352d5c0714a435294455b0"},{url:"/windows11/Square44x44Logo.targetsize-20.png",revision:"4c7fe4b8ba024a26bf0835a62c734633"},{url:"/windows11/Square44x44Logo.targetsize-24.png",revision:"9d021ecb4b0808dcf54356fa3676af9d"},{url:"/windows11/Square44x44Logo.targetsize-256.png",revision:"3396cba7779f6fb21ac9bab7d674b7ca"},{url:"/windows11/Square44x44Logo.targetsize-30.png",revision:"6b840a45dcdd3a36b47bcb50536a3d7d"},{url:"/windows11/Square44x44Logo.targetsize-32.png",revision:"dff9b12461c22267c2ddd46737273117"},{url:"/windows11/Square44x44Logo.targetsize-36.png",revision:"36031e02e303bbd4f5c0c21eadd7fd16"},{url:"/windows11/Square44x44Logo.targetsize-40.png",revision:"990c1e847ab7f81e2d533a246d9f4878"},{url:"/windows11/Square44x44Logo.targetsize-44.png",revision:"b8f453529990238789f02f69dc043008"},{url:"/windows11/Square44x44Logo.targetsize-48.png",revision:"228bb2fe714542cc501f7b4d83cf8ef2"},{url:"/windows11/Square44x44Logo.targetsize-60.png",revision:"f1ad0bb67613b4aabe5ac58404be1248"},{url:"/windows11/Square44x44Logo.targetsize-64.png",revision:"f0042cf341175a3d519c2309b04e5c70"},{url:"/windows11/Square44x44Logo.targetsize-72.png",revision:"4f592a70c7158effca334d5e1fee6ad1"},{url:"/windows11/Square44x44Logo.targetsize-80.png",revision:"f9cb4a8f8d6c30ad3ed4263c83c3d287"},{url:"/windows11/Square44x44Logo.targetsize-96.png",revision:"048eaddf2c490e494c91949fac570531"},{url:"/windows11/StoreLogo.scale-100.png",revision:"08a469f9129e6aa0facce46d8f60eb0c"},{url:"/windows11/StoreLogo.scale-125.png",revision:"bc9167bd2bf44ff54ab3f766642bb160"},{url:"/windows11/StoreLogo.scale-150.png",revision:"36fc5a47cef67ee6d1576cd80c15825a"},{url:"/windows11/StoreLogo.scale-200.png",revision:"2e7f40e526b0cdf2ae4a294bd0c3ea8b"},{url:"/windows11/StoreLogo.scale-400.png",revision:"d90a9e833526e7e00cdafabc3a18975c"},{url:"/windows11/Wide310x150Logo.scale-100.png",revision:"b3075423c4d8e0c375a218dee6ebe6c9"},{url:"/windows11/Wide310x150Logo.scale-125.png",revision:"9a88a2ce18d0fb8d5208b52d2a33d545"},{url:"/windows11/Wide310x150Logo.scale-150.png",revision:"5e93dc5bdef5350a3e425c51adc6e753"},{url:"/windows11/Wide310x150Logo.scale-200.png",revision:"2a4130daab547a40a0945982d154b962"},{url:"/windows11/Wide310x150Logo.scale-400.png",revision:"ad504430e0c600a913c82cc33c0ef0ed"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:i})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
