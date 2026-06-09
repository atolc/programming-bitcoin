import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const CHAPTER_FOLDERS = {
  es: {
    "campos-finitos": { number: 1, en: "finite-fields" },
    "curvas-elipticas": { number: 2, en: "elliptic-curves" },
    "criptografia-de-curva-eliptica": {
      number: 3,
      en: "elliptic-curve-cryptography",
    },
    serializacion: { number: 4, en: "serialization" },
    transacciones: { number: 5, en: "transactions" },
    script: { number: 6, en: "script" },
    "creacion-y-validacion-de-transacciones": {
      number: 7,
      en: "transaction-creation-and-validation",
    },
    "pay-to-script-hash": { number: 8, en: "pay-to-script-hash" },
    bloques: { number: 9, en: "blocks" },
    networking: { number: 10, en: "networking" },
    "verificacion-simplificada-de-pagos": {
      number: 11,
      en: "simplified-payment-verification",
    },
    "filtros-bloom": { number: 12, en: "bloom-filters" },
    segwit: { number: 13, en: "segwit" },
    "temas-avanzados-y-siguientes-pasos": {
      number: 14,
      en: "advanced-topics-and-next-steps",
    },
  },
};

const SECTION_EN = {
  "mapa-del-capitulo": "chapter-map",
  cierre: "conclusion",
  "por-que-empezar-por-campos-finitos": "why-start-with-finite-fields",
  "definicion-y-propiedades-de-un-campo-finito": "finite-field-definition",
  "aritmetica-modular-la-envoltura": "modulo-arithmetic",
  "suma-y-resta-en-fp": "finite-field-addition-and-subtraction",
  "multiplicacion-y-exponenciacion":
    "finite-field-multiplication-and-exponentiation",
  "por-que-el-orden-debe-ser-un-numero-primo": "why-fields-are-prime",
  "division-y-el-pequeno-teorema-de-fermat": "finite-field-division",
  "exponentes-negativos-y-grandes": "negative-and-large-exponents",
  "implementacion-en-python-de-fieldelement":
    "field-element-python-implementation",
  "practica-guiada-interactiva": "guided-interactive-practice",
  "definicion-de-la-curva-eliptica": "elliptic-curve-definition",
  "punto-al-infinito": "point-at-infinity",
  "validar-puntos-en-la-curva": "validating-points-on-the-curve",
  "suma-de-puntos-distintos": "point-addition",
  "duplicacion-de-un-punto": "point-doubling",
  "implementacion-en-python": "python-implementation",
  "curvas-sobre-campos-finitos": "curves-over-finite-fields",
  "grupos-y-llaves-publicas": "groups-and-public-keys",
  "suma-modular-de-puntos": "modular-point-addition",
  "secp256k1-en-numeros-pequenos": "secp256k1-with-small-numbers",
  "multiplicacion-escalar-double-and-add":
    "scalar-multiplication-double-and-add",
  "hashing-de-mensajes-concepto": "message-hashing-concept",
  "firmar-y-verificar": "signing-and-verifying",
  "orden-de-bytes-endianness": "byte-order-endianness",
  "llaves-publicas-sec": "sec-public-keys",
  "firmas-der": "der-signatures",
  "base58-y-base58check": "base58-and-base58check",
  "componentes-de-una-transaccion": "transaction-components",
  entradas: "inputs",
  salidas: "outputs",
  "codificacion-de-transacciones": "transaction-encoding",
  comisiones: "fees",
  "mecanica-del-script": "script-mechanics",
  "como-funciona-el-script": "how-script-works",
  "campos-al-parsear": "fields-when-parsing",
  "combinar-campos": "combining-fields",
  "p2pkh-problemas-y-soluciones": "p2pkh-problems-and-solutions",
  "scripts-arbitrarios": "arbitrary-scripts",
  "creacion-de-transacciones": "transaction-creation",
  "validacion-de-transacciones": "transaction-validation",
  "multisig-sin-envolver": "unwrapped-multisig",
  "codificacion-p2sh": "p2sh-encoding",
  motivacion: "motivation",
  "concepto-de-filtro-bloom": "bloom-filter-concept",
  "cargar-el-filtro": "loading-the-filter",
  "bloques-merkle": "merkle-blocks",
  "transacciones-de-interes": "transactions-of-interest",
  codificacion: "encoding",
  "otras-mejoras": "other-improvements",
  "temas-sugeridos": "suggested-topics",
  "proyectos-siguientes": "next-projects",
  contribuir: "contributing",
};

const manifest = [];

for (const [esFolder, meta] of Object.entries(CHAPTER_FOLDERS.es)) {
  const sectionsDir = join("docs", "es", esFolder, "sections");
  const sectionFiles = (await readdir(sectionsDir))
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));

  const sections = {};
  for (const esSlug of sectionFiles) {
    sections[esSlug] = {
      es: esSlug,
      en: SECTION_EN[esSlug] ?? esSlug,
    };
  }

  manifest.push({
    number: meta.number,
    folders: { es: esFolder, en: meta.en },
    sections,
  });
}

manifest.sort((a, b) => a.number - b.number);

await writeFile(
  "src/data/content-manifest.json",
  `${JSON.stringify(manifest, null, 2)}\n`,
);
await writeFile(
  "scripts/content-manifest.mjs",
  `export const CHAPTER_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n`,
);

console.log(`Generated manifest with ${manifest.length} chapters`);
