# REFLECTION.md — Лабротарын ажил 14 Эргэцүүлэл

## 1. Аль assertion хамгийн их үнэ цэнэтэй санагдсан вэ? Яагаад?

Хамгийн их үнэ цэнэтэй гэж үзсэн assertion бол **chain тест** буюу өмнөх response-оос авсан хувьсагчийг ашиглан дараагийн request-ийн зөрчлийг шалгах тест юм. Тухайлбал, `GET /users` request-аас `chainedUserId`-г авч, `GET /posts?userId={{chainedUserId}}` дахь бүх нийтлэлийн `userId` талбар уг утгатай таарч байгаа эсэхийг шалгасан тест:

```javascript
pm.test('Зөв хэрэглэгчийн нийтлэл буцаасан байх ёстой', () => {
  const data = pm.response.json();
  const userId = pm.environment.get('chainedUserId');
  data.forEach(post => {
    pm.expect(post.userId).to.eql(userId);
  });
});
```

Энэ assertion нь зүгээр нэг status code шалгахаас хавьгүй илүү гүнзгий учиртай. API нь зөв status code буцаадаг байж болох ч буруу өгөгдөл буцаадаг байж болно. Тухайлбал, pagination эсвэл filter алдаа гарвал `userId=1`-ийн request дээр `userId=2`-ийн өгөгдөл ирж болно. Ийм алдааг зөвхөн status code-оор илрүүлэх боломжгүй. Бизнес логикийн зөрчлийг шалгадаг assertion нь системийн зөв ажиллагааг баталгаажуулдаг тул хамгийн үнэтэй.

## 2. Negative test-ийн жишээ — яг ямар алдааг олох вэ?

`GET /posts/999999` request нь **negative test**-ийн сонгодог жишээ. Энэ тест нь дараах алдааг олоход чиглэсэн:

**Зорилт:** Системийн "алдааны зам" (error path) зөв ажиллаж байгаа эсэхийг шалгах.

**Яг ямар алдааг олох вэ?**
- Хэрэв API 999999-р ID-тай байхгүй нийтлэл хайхад `404` биш `200`-г буцааж, хоосон объект илгээвэл — энэ нь **REST contract зөрчсөн** хэрэг.
- Хэрэв `500 Internal Server Error` буцаавал — серверийн input validation сул байна гэсэн үг.
- Хэрэв response-ийн body нь тодорхойгүй бүтэцтэй (жишээ нь HTML error page) байвал — API нь JSON contract-аа зөрчиж байна.

```javascript
pm.test('Status 404 байх ёстой (negative test)', () => {
  pm.response.to.have.status(404);
});
pm.test('Response хоосон объект байх ёстой', () => {
  const data = pm.response.json();
  pm.expect(Object.keys(data).length).to.eql(0);
});
```

Энэ тест нь "хэвийн ажиллах"-ыг шалгахаас гадна "алдаатай оролт дээр зөв хариу өгөх" гэдгийг баталгаажуулдаг. API-ийн хагас нь энэ "алдааны зам" юм — тиймээс negative test нь тестийн бүрэлдэхүүний чухал хэсэг.

## 3. Postman-д амжилттай ажиллаж байсан тест Newman-д fail болсон уу? Яагаад?

Энэ лабораторид JSONPlaceholder ашигласан тул auth token байхгүй — гэвч ерөнхийдөө Postman дотор амжилттай боловч Newman-д fail болох тохиолдлууд байдаг:

**Нийтлэг шалтгаан:**
- **Environment variable дутуу:** Postman UI-д environment сонгон ажиллуулхад хувьсагч байдаг ч Newman-д `-e env.json` заагаагүй бол `{{baseUrl}}` тодорхойгүй болно.
- **Chain дарааллын асуудал:** Newman collection-ийг дараалсан байдлаар ажиллуулдаг ч pre-request script дотор async үйлдэл хийвэл дараагийн request эхлэхдээ хувьсагч тохируулагдаагүй байж болно.
- **Шифрлэлт/OS ялгаа:** Зарим регулярт илэрхийлэл (`match(/@/)`) нь Postman-ийн Chromium-д ажилладаг ч Newman-ийн Node.js орчинд өөрөөр биелдэг.

Ийм асуудлыг шийдэхийн тулд newman-д эхлээд `--verbose` флагтай ажиллуулж, аль request алдаа гарч байгааг тодорхойлох хэрэгтэй.

## 4. Token эсвэл secret-ыг хэрхэн зохицуулсан вэ?

JSONPlaceholder auth шаардахгүй тул энэ лабораторид бодит token хэрэгтэй болсонгүй. Гэвч secret зохицуулах соёлыг дараах байдлаар баримталсан:

**Environment-ийн соёл:**
- `env.dev.json` болон `env.ci.json` файлд token талбарыг `REPLACE_THIS_TOKEN` placeholder-оор орлуулсан.
- Эдгээр файлуудыг `.gitignore`-д оруулаагүй ч placeholder утга агуулдаг тул бодит нууц алдагдахгүй.
- Token шаардах API сонгосон бол GitHub Secrets-д `API_TOKEN` гэж хадгалаад, workflow дотор `echo "${{ secrets.API_TOKEN }}" > token.txt` гэж substitute хийх байсан.

**Хэзээ ч хийх ёсгүй:**
- Бодит API key-г `env.dev.json` файлд шууд commit хийхгүй.
- `.env` файлыг `.gitignore`-гүйгээр push хийхгүй.

## 5. API өөрчлөгдвөл collection-ийн аль хэсэг хамгийн их эвдрэх вэ?

**Хамгийн эмзэг хэсэг: Chain хийсэн request-ууд**

`GET /users` → `chainedUserId` → `GET /posts?userId={{chainedUserId}}` гэсэн гинжин хамаарал нь хамгийн эмзэг. Хэрэв:
- `/users` endpoint-ийн response бүтэц өөрчлөгдөж `id` талбар нэр өөрчлөгдвөл (жишээ нь `userId` болвол)
- Эсвэл `/posts?userId=` filter хэрэгжүүлэлт өөрчлөгдвөл

Бүх chain эвдрэнэ. Нэг request-ийн алдаа эхлэн бусад бүхнийг дараалан fail болгодог.

**Бууруулах арга:**
- Chain-ийн эхний хүсэлтэд `pre-request script` дотор defensive хуулбарлалт хийх: `pm.environment.get('chainedUserId') || 1`
- Schema validation assertion ашиглан талбарын нэр тогтмол байгааг урьдчилж шалгах
- Collection-д `folder`-уудыг бие даасан байдлаар ажиллуулах боломжтой болгох (Chain dependency-г README-д тодорхойлох)

**Ерөнхий зөвлөгөө:** API-ийн "эмзэг газар"-ыг бууруулах хамгийн сайн арга бол `baseUrl`-ийг environment variable болгосон шиг, бүх dynamic утгыг хувьсагчаар авч хатуу утгаар hardcode хийхгүй байх явдал юм.