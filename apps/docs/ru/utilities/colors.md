# Цвета

Vueland UI генерирует цветовые утилиты из `colors-map.scss`. Основная палитра следует Material Design: большинство цветов доступны в вариантах `lighten-5` → `darken-4` и четырёх акцентах. Дополнительные палитры раскрывают варианты, описанные в своей карте.

## Классы

| Класс                    | CSS-свойство                     |
| ------------------------ | -------------------------------- |
| `bg-{color}`             | `background-color` (base)        |
| `bg-{color}-{variant}`   | `background-color` (вариант)     |
| `text-{color}`           | `color` (base)                   |
| `text-{color}-{variant}` | `color` (вариант)                |
| `hover:bg-{color}`       | `background-color` при наведении |
| `active:bg-{color}`      | `background-color` при нажатии   |

```html
<div class="bg-blue">синий фон</div>
<div class="bg-red-lighten-3">светло-красный фон</div>
<div class="bg-graphite-lighten-2">графитовый фон</div>
<div class="text-teal">цвет текста teal</div>
<div class="hover:bg-green pa-4">зелёный при наведении</div>
```

## Палитра

<style>
.cp { margin: 32px 0; }
.cp-name {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  margin-bottom: 6px;
}
.cp-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.cs {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 84px;
  height: 84px;
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 10px;
  line-height: 1.4;
  box-shadow: 0 1px 4px rgba(0,0,0,.18);
  cursor: default;
  flex-shrink: 0;
}
.cs b { font-weight: 700; display: block; }
.cs span { opacity: .85; display: block; }
.lt { color: #fff; }
.dk { color: #212121; }
.cp-sep { border-top: 1px solid var(--vp-c-divider); margin: 32px 0 0; }
</style>

<div class="cp">
<div class="cp-name">White · Black</div>
<div class="cp-row">
<div class="cs dk" style="background:#ffffff;border:1px solid #e0e0e0"><b>white</b><span>base</span><span>#FFFFFF</span></div>
<div class="cs lt" style="background:#000000"><b>black</b><span>base</span><span>#000000</span></div>
</div>
</div>

<div class="cp-sep"></div>

<div class="cp">
<div class="cp-name">Red</div>
<div class="cp-row">
<div class="cs dk" style="background:#FFEBEE"><b>lighten-5</b><span>#FFEBEE</span></div>
<div class="cs dk" style="background:#FFCDD2"><b>lighten-4</b><span>#FFCDD2</span></div>
<div class="cs dk" style="background:#EF9A9A"><b>lighten-3</b><span>#EF9A9A</span></div>
<div class="cs dk" style="background:#E57373"><b>lighten-2</b><span>#E57373</span></div>
<div class="cs lt" style="background:#EF5350"><b>lighten-1</b><span>#EF5350</span></div>
<div class="cs lt" style="background:#F44336"><b>base</b><span>#F44336</span></div>
<div class="cs lt" style="background:#E53935"><b>darken-1</b><span>#E53935</span></div>
<div class="cs lt" style="background:#D32F2F"><b>darken-2</b><span>#D32F2F</span></div>
<div class="cs lt" style="background:#C62828"><b>darken-3</b><span>#C62828</span></div>
<div class="cs lt" style="background:#B71C1C"><b>darken-4</b><span>#B71C1C</span></div>
<div class="cs dk" style="background:#FF8A80"><b>accent-1</b><span>#FF8A80</span></div>
<div class="cs dk" style="background:#FF5252"><b>accent-2</b><span>#FF5252</span></div>
<div class="cs lt" style="background:#FF1744"><b>accent-3</b><span>#FF1744</span></div>
<div class="cs lt" style="background:#D50000"><b>accent-4</b><span>#D50000</span></div>
</div>
</div>

<div class="cp-sep"></div>

<div class="cp">
<div class="cp-name">Pink</div>
<div class="cp-row">
<div class="cs dk" style="background:#FCE4EC"><b>lighten-5</b><span>#FCE4EC</span></div>
<div class="cs dk" style="background:#F8BBD0"><b>lighten-4</b><span>#F8BBD0</span></div>
<div class="cs dk" style="background:#F48FB1"><b>lighten-3</b><span>#F48FB1</span></div>
<div class="cs dk" style="background:#F06292"><b>lighten-2</b><span>#F06292</span></div>
<div class="cs lt" style="background:#EC407A"><b>lighten-1</b><span>#EC407A</span></div>
<div class="cs lt" style="background:#E91E63"><b>base</b><span>#E91E63</span></div>
<div class="cs lt" style="background:#D81B60"><b>darken-1</b><span>#D81B60</span></div>
<div class="cs lt" style="background:#C2185B"><b>darken-2</b><span>#C2185B</span></div>
<div class="cs lt" style="background:#AD1457"><b>darken-3</b><span>#AD1457</span></div>
<div class="cs lt" style="background:#880E4F"><b>darken-4</b><span>#880E4F</span></div>
<div class="cs dk" style="background:#FF80AB"><b>accent-1</b><span>#FF80AB</span></div>
<div class="cs lt" style="background:#FF4081"><b>accent-2</b><span>#FF4081</span></div>
<div class="cs lt" style="background:#F50057"><b>accent-3</b><span>#F50057</span></div>
<div class="cs lt" style="background:#C51162"><b>accent-4</b><span>#C51162</span></div>
</div>
</div>

<div class="cp-sep"></div>

<div class="cp">
<div class="cp-name">Purple</div>
<div class="cp-row">
<div class="cs dk" style="background:#F3E5F5"><b>lighten-5</b><span>#F3E5F5</span></div>
<div class="cs dk" style="background:#E1BEE7"><b>lighten-4</b><span>#E1BEE7</span></div>
<div class="cs dk" style="background:#CE93D8"><b>lighten-3</b><span>#CE93D8</span></div>
<div class="cs dk" style="background:#BA68C8"><b>lighten-2</b><span>#BA68C8</span></div>
<div class="cs lt" style="background:#AB47BC"><b>lighten-1</b><span>#AB47BC</span></div>
<div class="cs lt" style="background:#9C27B0"><b>base</b><span>#9C27B0</span></div>
<div class="cs lt" style="background:#8E24AA"><b>darken-1</b><span>#8E24AA</span></div>
<div class="cs lt" style="background:#7B1FA2"><b>darken-2</b><span>#7B1FA2</span></div>
<div class="cs lt" style="background:#6A1B9A"><b>darken-3</b><span>#6A1B9A</span></div>
<div class="cs lt" style="background:#4A148C"><b>darken-4</b><span>#4A148C</span></div>
<div class="cs dk" style="background:#EA80FC"><b>accent-1</b><span>#EA80FC</span></div>
<div class="cs lt" style="background:#E040FB"><b>accent-2</b><span>#E040FB</span></div>
<div class="cs lt" style="background:#D500F9"><b>accent-3</b><span>#D500F9</span></div>
<div class="cs lt" style="background:#AA00FF"><b>accent-4</b><span>#AA00FF</span></div>
</div>
</div>

<div class="cp-sep"></div>

<div class="cp">
<div class="cp-name">Deep Purple</div>
<div class="cp-row">
<div class="cs dk" style="background:#EDE7F6"><b>lighten-5</b><span>#EDE7F6</span></div>
<div class="cs dk" style="background:#D1C4E9"><b>lighten-4</b><span>#D1C4E9</span></div>
<div class="cs dk" style="background:#B39DDB"><b>lighten-3</b><span>#B39DDB</span></div>
<div class="cs dk" style="background:#9575CD"><b>lighten-2</b><span>#9575CD</span></div>
<div class="cs lt" style="background:#7E57C2"><b>lighten-1</b><span>#7E57C2</span></div>
<div class="cs lt" style="background:#673AB7"><b>base</b><span>#673AB7</span></div>
<div class="cs lt" style="background:#5E35B1"><b>darken-1</b><span>#5E35B1</span></div>
<div class="cs lt" style="background:#512DA8"><b>darken-2</b><span>#512DA8</span></div>
<div class="cs lt" style="background:#4527A0"><b>darken-3</b><span>#4527A0</span></div>
<div class="cs lt" style="background:#311B92"><b>darken-4</b><span>#311B92</span></div>
<div class="cs dk" style="background:#B388FF"><b>accent-1</b><span>#B388FF</span></div>
<div class="cs lt" style="background:#7C4DFF"><b>accent-2</b><span>#7C4DFF</span></div>
<div class="cs lt" style="background:#651FFF"><b>accent-3</b><span>#651FFF</span></div>
<div class="cs lt" style="background:#6200EA"><b>accent-4</b><span>#6200EA</span></div>
</div>
</div>

<div class="cp-sep"></div>

<div class="cp">
<div class="cp-name">Indigo</div>
<div class="cp-row">
<div class="cs dk" style="background:#E8EAF6"><b>lighten-5</b><span>#E8EAF6</span></div>
<div class="cs dk" style="background:#C5CAE9"><b>lighten-4</b><span>#C5CAE9</span></div>
<div class="cs dk" style="background:#9FA8DA"><b>lighten-3</b><span>#9FA8DA</span></div>
<div class="cs dk" style="background:#7986CB"><b>lighten-2</b><span>#7986CB</span></div>
<div class="cs lt" style="background:#5C6BC0"><b>lighten-1</b><span>#5C6BC0</span></div>
<div class="cs lt" style="background:#3F51B5"><b>base</b><span>#3F51B5</span></div>
<div class="cs lt" style="background:#3949AB"><b>darken-1</b><span>#3949AB</span></div>
<div class="cs lt" style="background:#303F9F"><b>darken-2</b><span>#303F9F</span></div>
<div class="cs lt" style="background:#283593"><b>darken-3</b><span>#283593</span></div>
<div class="cs lt" style="background:#1A237E"><b>darken-4</b><span>#1A237E</span></div>
<div class="cs dk" style="background:#8C9EFF"><b>accent-1</b><span>#8C9EFF</span></div>
<div class="cs lt" style="background:#536DFE"><b>accent-2</b><span>#536DFE</span></div>
<div class="cs lt" style="background:#3D5AFE"><b>accent-3</b><span>#3D5AFE</span></div>
<div class="cs lt" style="background:#304FFE"><b>accent-4</b><span>#304FFE</span></div>
</div>
</div>

<div class="cp-sep"></div>

<div class="cp">
<div class="cp-name">Blue</div>
<div class="cp-row">
<div class="cs dk" style="background:#E3F2FD"><b>lighten-5</b><span>#E3F2FD</span></div>
<div class="cs dk" style="background:#BBDEFB"><b>lighten-4</b><span>#BBDEFB</span></div>
<div class="cs dk" style="background:#90CAF9"><b>lighten-3</b><span>#90CAF9</span></div>
<div class="cs dk" style="background:#64B5F6"><b>lighten-2</b><span>#64B5F6</span></div>
<div class="cs dk" style="background:#42A5F5"><b>lighten-1</b><span>#42A5F5</span></div>
<div class="cs lt" style="background:#2196F3"><b>base</b><span>#2196F3</span></div>
<div class="cs lt" style="background:#1E88E5"><b>darken-1</b><span>#1E88E5</span></div>
<div class="cs lt" style="background:#1976D2"><b>darken-2</b><span>#1976D2</span></div>
<div class="cs lt" style="background:#1565C0"><b>darken-3</b><span>#1565C0</span></div>
<div class="cs lt" style="background:#0D47A1"><b>darken-4</b><span>#0D47A1</span></div>
<div class="cs dk" style="background:#82B1FF"><b>accent-1</b><span>#82B1FF</span></div>
<div class="cs dk" style="background:#448AFF"><b>accent-2</b><span>#448AFF</span></div>
<div class="cs lt" style="background:#2979FF"><b>accent-3</b><span>#2979FF</span></div>
<div class="cs lt" style="background:#2962FF"><b>accent-4</b><span>#2962FF</span></div>
</div>
</div>

<div class="cp-sep"></div>

<div class="cp">
<div class="cp-name">Light Blue</div>
<div class="cp-row">
<div class="cs dk" style="background:#E1F5FE"><b>lighten-5</b><span>#E1F5FE</span></div>
<div class="cs dk" style="background:#B3E5FC"><b>lighten-4</b><span>#B3E5FC</span></div>
<div class="cs dk" style="background:#81D4FA"><b>lighten-3</b><span>#81D4FA</span></div>
<div class="cs dk" style="background:#4FC3F7"><b>lighten-2</b><span>#4FC3F7</span></div>
<div class="cs dk" style="background:#29B6F6"><b>lighten-1</b><span>#29B6F6</span></div>
<div class="cs dk" style="background:#03A9F4"><b>base</b><span>#03A9F4</span></div>
<div class="cs lt" style="background:#039BE5"><b>darken-1</b><span>#039BE5</span></div>
<div class="cs lt" style="background:#0288D1"><b>darken-2</b><span>#0288D1</span></div>
<div class="cs lt" style="background:#0277BD"><b>darken-3</b><span>#0277BD</span></div>
<div class="cs lt" style="background:#01579B"><b>darken-4</b><span>#01579B</span></div>
<div class="cs dk" style="background:#80D8FF"><b>accent-1</b><span>#80D8FF</span></div>
<div class="cs dk" style="background:#40C4FF"><b>accent-2</b><span>#40C4FF</span></div>
<div class="cs dk" style="background:#00B0FF"><b>accent-3</b><span>#00B0FF</span></div>
<div class="cs lt" style="background:#0091EA"><b>accent-4</b><span>#0091EA</span></div>
</div>
</div>

<div class="cp-sep"></div>

<div class="cp">
<div class="cp-name">Cyan</div>
<div class="cp-row">
<div class="cs dk" style="background:#E0F7FA"><b>lighten-5</b><span>#E0F7FA</span></div>
<div class="cs dk" style="background:#B2EBF2"><b>lighten-4</b><span>#B2EBF2</span></div>
<div class="cs dk" style="background:#80DEEA"><b>lighten-3</b><span>#80DEEA</span></div>
<div class="cs dk" style="background:#4DD0E1"><b>lighten-2</b><span>#4DD0E1</span></div>
<div class="cs dk" style="background:#26C6DA"><b>lighten-1</b><span>#26C6DA</span></div>
<div class="cs dk" style="background:#00BCD4"><b>base</b><span>#00BCD4</span></div>
<div class="cs lt" style="background:#00ACC1"><b>darken-1</b><span>#00ACC1</span></div>
<div class="cs lt" style="background:#0097A7"><b>darken-2</b><span>#0097A7</span></div>
<div class="cs lt" style="background:#00838F"><b>darken-3</b><span>#00838F</span></div>
<div class="cs lt" style="background:#006064"><b>darken-4</b><span>#006064</span></div>
<div class="cs dk" style="background:#84FFFF"><b>accent-1</b><span>#84FFFF</span></div>
<div class="cs dk" style="background:#18FFFF"><b>accent-2</b><span>#18FFFF</span></div>
<div class="cs dk" style="background:#00E5FF"><b>accent-3</b><span>#00E5FF</span></div>
<div class="cs dk" style="background:#00B8D4"><b>accent-4</b><span>#00B8D4</span></div>
</div>
</div>

<div class="cp-sep"></div>

<div class="cp">
<div class="cp-name">Teal</div>
<div class="cp-row">
<div class="cs dk" style="background:#E0F2F1"><b>lighten-5</b><span>#E0F2F1</span></div>
<div class="cs dk" style="background:#B2DFDB"><b>lighten-4</b><span>#B2DFDB</span></div>
<div class="cs dk" style="background:#80CBC4"><b>lighten-3</b><span>#80CBC4</span></div>
<div class="cs dk" style="background:#4DB6AC"><b>lighten-2</b><span>#4DB6AC</span></div>
<div class="cs dk" style="background:#26A69A"><b>lighten-1</b><span>#26A69A</span></div>
<div class="cs lt" style="background:#009688"><b>base</b><span>#009688</span></div>
<div class="cs lt" style="background:#00897B"><b>darken-1</b><span>#00897B</span></div>
<div class="cs lt" style="background:#00796B"><b>darken-2</b><span>#00796B</span></div>
<div class="cs lt" style="background:#00695C"><b>darken-3</b><span>#00695C</span></div>
<div class="cs lt" style="background:#004D40"><b>darken-4</b><span>#004D40</span></div>
<div class="cs dk" style="background:#A7FFEB"><b>accent-1</b><span>#A7FFEB</span></div>
<div class="cs dk" style="background:#64FFDA"><b>accent-2</b><span>#64FFDA</span></div>
<div class="cs dk" style="background:#1DE9B6"><b>accent-3</b><span>#1DE9B6</span></div>
<div class="cs dk" style="background:#00BFA5"><b>accent-4</b><span>#00BFA5</span></div>
</div>
</div>

<div class="cp-sep"></div>

<div class="cp">
<div class="cp-name">Green</div>
<div class="cp-row">
<div class="cs dk" style="background:#E8F5E9"><b>lighten-5</b><span>#E8F5E9</span></div>
<div class="cs dk" style="background:#C8E6C9"><b>lighten-4</b><span>#C8E6C9</span></div>
<div class="cs dk" style="background:#A5D6A7"><b>lighten-3</b><span>#A5D6A7</span></div>
<div class="cs dk" style="background:#81C784"><b>lighten-2</b><span>#81C784</span></div>
<div class="cs dk" style="background:#66BB6A"><b>lighten-1</b><span>#66BB6A</span></div>
<div class="cs lt" style="background:#4CAF50"><b>base</b><span>#4CAF50</span></div>
<div class="cs lt" style="background:#43A047"><b>darken-1</b><span>#43A047</span></div>
<div class="cs lt" style="background:#388E3C"><b>darken-2</b><span>#388E3C</span></div>
<div class="cs lt" style="background:#2E7D32"><b>darken-3</b><span>#2E7D32</span></div>
<div class="cs lt" style="background:#1B5E20"><b>darken-4</b><span>#1B5E20</span></div>
<div class="cs dk" style="background:#B9F6CA"><b>accent-1</b><span>#B9F6CA</span></div>
<div class="cs dk" style="background:#69F0AE"><b>accent-2</b><span>#69F0AE</span></div>
<div class="cs dk" style="background:#00E676"><b>accent-3</b><span>#00E676</span></div>
<div class="cs dk" style="background:#00C853"><b>accent-4</b><span>#00C853</span></div>
</div>
</div>

<div class="cp-sep"></div>

<div class="cp">
<div class="cp-name">Light Green</div>
<div class="cp-row">
<div class="cs dk" style="background:#F1F8E9"><b>lighten-5</b><span>#F1F8E9</span></div>
<div class="cs dk" style="background:#DCEDC8"><b>lighten-4</b><span>#DCEDC8</span></div>
<div class="cs dk" style="background:#C5E1A5"><b>lighten-3</b><span>#C5E1A5</span></div>
<div class="cs dk" style="background:#AED581"><b>lighten-2</b><span>#AED581</span></div>
<div class="cs dk" style="background:#9CCC65"><b>lighten-1</b><span>#9CCC65</span></div>
<div class="cs dk" style="background:#8BC34A"><b>base</b><span>#8BC34A</span></div>
<div class="cs lt" style="background:#7CB342"><b>darken-1</b><span>#7CB342</span></div>
<div class="cs lt" style="background:#689F38"><b>darken-2</b><span>#689F38</span></div>
<div class="cs lt" style="background:#558B2F"><b>darken-3</b><span>#558B2F</span></div>
<div class="cs lt" style="background:#33691E"><b>darken-4</b><span>#33691E</span></div>
<div class="cs dk" style="background:#CCFF90"><b>accent-1</b><span>#CCFF90</span></div>
<div class="cs dk" style="background:#B2FF59"><b>accent-2</b><span>#B2FF59</span></div>
<div class="cs dk" style="background:#76FF03"><b>accent-3</b><span>#76FF03</span></div>
<div class="cs dk" style="background:#64DD17"><b>accent-4</b><span>#64DD17</span></div>
</div>
</div>

<div class="cp-sep"></div>

<div class="cp">
<div class="cp-name">Lime</div>
<div class="cp-row">
<div class="cs dk" style="background:#F9FBE7"><b>lighten-5</b><span>#F9FBE7</span></div>
<div class="cs dk" style="background:#F0F4C3"><b>lighten-4</b><span>#F0F4C3</span></div>
<div class="cs dk" style="background:#E6EE9C"><b>lighten-3</b><span>#E6EE9C</span></div>
<div class="cs dk" style="background:#DCE775"><b>lighten-2</b><span>#DCE775</span></div>
<div class="cs dk" style="background:#D4E157"><b>lighten-1</b><span>#D4E157</span></div>
<div class="cs dk" style="background:#CDDC39"><b>base</b><span>#CDDC39</span></div>
<div class="cs dk" style="background:#C0CA33"><b>darken-1</b><span>#C0CA33</span></div>
<div class="cs dk" style="background:#AFB42B"><b>darken-2</b><span>#AFB42B</span></div>
<div class="cs lt" style="background:#9E9D24"><b>darken-3</b><span>#9E9D24</span></div>
<div class="cs lt" style="background:#827717"><b>darken-4</b><span>#827717</span></div>
<div class="cs dk" style="background:#F4FF81"><b>accent-1</b><span>#F4FF81</span></div>
<div class="cs dk" style="background:#EEFF41"><b>accent-2</b><span>#EEFF41</span></div>
<div class="cs dk" style="background:#C6FF00"><b>accent-3</b><span>#C6FF00</span></div>
<div class="cs dk" style="background:#AEEA00"><b>accent-4</b><span>#AEEA00</span></div>
</div>
</div>

<div class="cp-sep"></div>

<div class="cp">
<div class="cp-name">Yellow</div>
<div class="cp-row">
<div class="cs dk" style="background:#FFFDE7"><b>lighten-5</b><span>#FFFDE7</span></div>
<div class="cs dk" style="background:#FFF9C4"><b>lighten-4</b><span>#FFF9C4</span></div>
<div class="cs dk" style="background:#FFF59D"><b>lighten-3</b><span>#FFF59D</span></div>
<div class="cs dk" style="background:#FFF176"><b>lighten-2</b><span>#FFF176</span></div>
<div class="cs dk" style="background:#FFEE58"><b>lighten-1</b><span>#FFEE58</span></div>
<div class="cs dk" style="background:#FFEB3B"><b>base</b><span>#FFEB3B</span></div>
<div class="cs dk" style="background:#FDD835"><b>darken-1</b><span>#FDD835</span></div>
<div class="cs dk" style="background:#F9A825"><b>darken-2</b><span>#F9A825</span></div>
<div class="cs dk" style="background:#F57F17"><b>darken-3</b><span>#F57F17</span></div>
<div class="cs lt" style="background:#E65100"><b>darken-4</b><span>#E65100</span></div>
<div class="cs dk" style="background:#FFFF8D"><b>accent-1</b><span>#FFFF8D</span></div>
<div class="cs dk" style="background:#FFFF00"><b>accent-2</b><span>#FFFF00</span></div>
<div class="cs dk" style="background:#FFEA00"><b>accent-3</b><span>#FFEA00</span></div>
<div class="cs dk" style="background:#FFD600"><b>accent-4</b><span>#FFD600</span></div>
</div>
</div>

<div class="cp-sep"></div>

<div class="cp">
<div class="cp-name">Amber</div>
<div class="cp-row">
<div class="cs dk" style="background:#FFF8E1"><b>lighten-5</b><span>#FFF8E1</span></div>
<div class="cs dk" style="background:#FFECB3"><b>lighten-4</b><span>#FFECB3</span></div>
<div class="cs dk" style="background:#FFE082"><b>lighten-3</b><span>#FFE082</span></div>
<div class="cs dk" style="background:#FFD54F"><b>lighten-2</b><span>#FFD54F</span></div>
<div class="cs dk" style="background:#FFCA28"><b>lighten-1</b><span>#FFCA28</span></div>
<div class="cs dk" style="background:#FFC107"><b>base</b><span>#FFC107</span></div>
<div class="cs dk" style="background:#FFB300"><b>darken-1</b><span>#FFB300</span></div>
<div class="cs dk" style="background:#FFA000"><b>darken-2</b><span>#FFA000</span></div>
<div class="cs dk" style="background:#FF8F00"><b>darken-3</b><span>#FF8F00</span></div>
<div class="cs lt" style="background:#FF6F00"><b>darken-4</b><span>#FF6F00</span></div>
<div class="cs dk" style="background:#FFE57F"><b>accent-1</b><span>#FFE57F</span></div>
<div class="cs dk" style="background:#FFD740"><b>accent-2</b><span>#FFD740</span></div>
<div class="cs dk" style="background:#FFC400"><b>accent-3</b><span>#FFC400</span></div>
<div class="cs dk" style="background:#FFAB00"><b>accent-4</b><span>#FFAB00</span></div>
</div>
</div>

<div class="cp-sep"></div>

<div class="cp">
<div class="cp-name">Orange</div>
<div class="cp-row">
<div class="cs dk" style="background:#FFF3E0"><b>lighten-5</b><span>#FFF3E0</span></div>
<div class="cs dk" style="background:#FFE0B2"><b>lighten-4</b><span>#FFE0B2</span></div>
<div class="cs dk" style="background:#FFCC80"><b>lighten-3</b><span>#FFCC80</span></div>
<div class="cs dk" style="background:#FFB74D"><b>lighten-2</b><span>#FFB74D</span></div>
<div class="cs dk" style="background:#FFA726"><b>lighten-1</b><span>#FFA726</span></div>
<div class="cs dk" style="background:#FF9800"><b>base</b><span>#FF9800</span></div>
<div class="cs dk" style="background:#FB8C00"><b>darken-1</b><span>#FB8C00</span></div>
<div class="cs lt" style="background:#F57C00"><b>darken-2</b><span>#F57C00</span></div>
<div class="cs lt" style="background:#EF6C00"><b>darken-3</b><span>#EF6C00</span></div>
<div class="cs lt" style="background:#E65100"><b>darken-4</b><span>#E65100</span></div>
<div class="cs dk" style="background:#FFD180"><b>accent-1</b><span>#FFD180</span></div>
<div class="cs dk" style="background:#FFAB40"><b>accent-2</b><span>#FFAB40</span></div>
<div class="cs dk" style="background:#FF9100"><b>accent-3</b><span>#FF9100</span></div>
<div class="cs dk" style="background:#FF6D00"><b>accent-4</b><span>#FF6D00</span></div>
</div>
</div>

<div class="cp-sep"></div>

<div class="cp">
<div class="cp-name">Deep Orange</div>
<div class="cp-row">
<div class="cs dk" style="background:#FBE9E7"><b>lighten-5</b><span>#FBE9E7</span></div>
<div class="cs dk" style="background:#FFCCBC"><b>lighten-4</b><span>#FFCCBC</span></div>
<div class="cs dk" style="background:#FFAB91"><b>lighten-3</b><span>#FFAB91</span></div>
<div class="cs dk" style="background:#FF8A65"><b>lighten-2</b><span>#FF8A65</span></div>
<div class="cs dk" style="background:#FF7043"><b>lighten-1</b><span>#FF7043</span></div>
<div class="cs lt" style="background:#FF5722"><b>base</b><span>#FF5722</span></div>
<div class="cs lt" style="background:#F4511E"><b>darken-1</b><span>#F4511E</span></div>
<div class="cs lt" style="background:#E64A19"><b>darken-2</b><span>#E64A19</span></div>
<div class="cs lt" style="background:#D84315"><b>darken-3</b><span>#D84315</span></div>
<div class="cs lt" style="background:#BF360C"><b>darken-4</b><span>#BF360C</span></div>
<div class="cs dk" style="background:#FF9E80"><b>accent-1</b><span>#FF9E80</span></div>
<div class="cs dk" style="background:#FF6E40"><b>accent-2</b><span>#FF6E40</span></div>
<div class="cs lt" style="background:#FF3D00"><b>accent-3</b><span>#FF3D00</span></div>
<div class="cs lt" style="background:#DD2C00"><b>accent-4</b><span>#DD2C00</span></div>
</div>
</div>

<div class="cp-sep"></div>

<div class="cp">
<div class="cp-name">Brown</div>
<div class="cp-row">
<div class="cs dk" style="background:#EFEBE9"><b>lighten-5</b><span>#EFEBE9</span></div>
<div class="cs dk" style="background:#D7CCC8"><b>lighten-4</b><span>#D7CCC8</span></div>
<div class="cs dk" style="background:#BCAAA4"><b>lighten-3</b><span>#BCAAA4</span></div>
<div class="cs dk" style="background:#A1887F"><b>lighten-2</b><span>#A1887F</span></div>
<div class="cs lt" style="background:#8D6E63"><b>lighten-1</b><span>#8D6E63</span></div>
<div class="cs lt" style="background:#795548"><b>base</b><span>#795548</span></div>
<div class="cs lt" style="background:#6D4C41"><b>darken-1</b><span>#6D4C41</span></div>
<div class="cs lt" style="background:#5D4037"><b>darken-2</b><span>#5D4037</span></div>
<div class="cs lt" style="background:#4E342E"><b>darken-3</b><span>#4E342E</span></div>
<div class="cs lt" style="background:#3E2723"><b>darken-4</b><span>#3E2723</span></div>
</div>
</div>

<div class="cp-sep"></div>

<div class="cp">
<div class="cp-name">Blue Grey</div>
<div class="cp-row">
<div class="cs dk" style="background:#ECEFF1"><b>lighten-5</b><span>#ECEFF1</span></div>
<div class="cs dk" style="background:#CFD8DC"><b>lighten-4</b><span>#CFD8DC</span></div>
<div class="cs dk" style="background:#B0BEC5"><b>lighten-3</b><span>#B0BEC5</span></div>
<div class="cs dk" style="background:#90A4AE"><b>lighten-2</b><span>#90A4AE</span></div>
<div class="cs dk" style="background:#78909C"><b>lighten-1</b><span>#78909C</span></div>
<div class="cs lt" style="background:#607D8B"><b>base</b><span>#607D8B</span></div>
<div class="cs lt" style="background:#546E7A"><b>darken-1</b><span>#546E7A</span></div>
<div class="cs lt" style="background:#455A64"><b>darken-2</b><span>#455A64</span></div>
<div class="cs lt" style="background:#37474F"><b>darken-3</b><span>#37474F</span></div>
<div class="cs lt" style="background:#263238"><b>darken-4</b><span>#263238</span></div>
</div>
</div>

<div class="cp-sep"></div>

<div class="cp">
<div class="cp-name">Grey</div>
<div class="cp-row">
<div class="cs dk" style="background:#FAFAFA"><b>lighten-5</b><span>#FAFAFA</span></div>
<div class="cs dk" style="background:#F5F5F5"><b>lighten-4</b><span>#F5F5F5</span></div>
<div class="cs dk" style="background:#EEEEEE"><b>lighten-3</b><span>#EEEEEE</span></div>
<div class="cs dk" style="background:#E0E0E0"><b>lighten-2</b><span>#E0E0E0</span></div>
<div class="cs dk" style="background:#BDBDBD"><b>lighten-1</b><span>#BDBDBD</span></div>
<div class="cs dk" style="background:#9E9E9E"><b>base</b><span>#9E9E9E</span></div>
<div class="cs dk" style="background:#757575"><b>darken-1</b><span>#757575</span></div>
<div class="cs lt" style="background:#616161"><b>darken-2</b><span>#616161</span></div>
<div class="cs lt" style="background:#424242"><b>darken-3</b><span>#424242</span></div>
<div class="cs lt" style="background:#212121"><b>darken-4</b><span>#212121</span></div>
</div>
</div>

<div class="cp-sep"></div>

<div class="cp">
<div class="cp-name">Graphite</div>
<div class="cp-row">
<div class="cs lt" style="background:#333333"><b>lighten-3</b><span>#333333</span></div>
<div class="cs lt" style="background:#2F2F2F"><b>lighten-2</b><span>#2F2F2F</span></div>
<div class="cs lt" style="background:#2A2A2A"><b>lighten-1</b><span>#2A2A2A</span></div>
<div class="cs lt" style="background:#242424"><b>base</b><span>#242424</span></div>
<div class="cs lt" style="background:#202020"><b>darken-1</b><span>#202020</span></div>
<div class="cs lt" style="background:#1E1E1E"><b>darken-2</b><span>#1E1E1E</span></div>
<div class="cs lt" style="background:#161616"><b>darken-3</b><span>#161616</span></div>
<div class="cs lt" style="background:#121212"><b>darken-4</b><span>#121212</span></div>
</div>
</div>
