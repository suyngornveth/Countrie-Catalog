
<script>
import "vue3-easy-data-table";
export default {
  data() {
    return {
      all: null,
      detail: {},
      searchValue: '',
      text: '<h1>Hello world</h1>',
      headers: [
        { text: "No", value: "index" },
        { text: "Flag", value: "flag" },
        { text: "Country Name", value: "name", sortable: true },
        { text: "cca2", value: "cca2", sortable: true },
        { text: "cca3", value: "cca3", sortable: true },
        { text: "Native Name", value: "native_name", sortable: true },
        { text: "Alternative  Name", value: "alternative_name", sortable: true },
        { text: "Calling Codes", value: "idd", sortable: true },
      ],
      items: []
    }

  },
  mounted() {
    this.getData()
  },
  methods: {
    getData: function () {
      let me = this;
      this.axios.get("https://restcountries.com/v3.1/all").then((response) => {
        me.all = response.data;
      })

    },
    getCountryByCCA3: function (cca3) {
      let me = this;
      this.axios.get(`https://restcountries.com/v3.1/alpha/${cca3}`).then((response) => {
        me.detail = response.data[0]
      }).then(function () {
        me.generateDetail();
      })
    },
    clickDetail: function (item) {
      this.detail = {}
      this.getCountryByCCA3(item.cca3)
      let btn = document.getElementById('btn-detailModal')
      btn.click()

    },
    generateDetail: function () {
      let html = "<ul>";
      html = this.setChild(html, this.detail)

      html += "</ul>"

      this.text = html;
    },
    setChild: function (html, child) {
      let me = this;
      Object.entries(child).every(([key, value]) => {
        html += `<li>`;
        if (isNaN(key)) {
          html += `${key} : `
        }
        if (typeof value == "object") {
          html += "<ul>";
          html = me.setChild(html, value);
          html += "</ul></li>"
        } else {
          html += ` ${value}</li>`
        }
        return true;
      })
      return html;
    }
  },
  watch: {
    all: function (n, o) {
      let data = [];
      let i = 0;
      Object.entries(n).every(([key, value]) => {
        let nativeName = '';
        let idd = '';
        if (typeof value.name.nativeName != "undefined") {
          Object.values(value.name.nativeName).every(v => {
            nativeName = v.official;
            return false;
          })
        }

        if (typeof value.idd.suffixes != 'undefined') {
          Object.values(value.idd.suffixes).every(v => {
            idd = value.idd.root + v
            return false;
          })
        }

        data.push({
          'index': ++i,
          'flagURL': value.flags.png,
          'name': value.name.official,
          'cca2': value.cca2,
          'cca3': value.cca3,
          'native_name': nativeName,
          'alternative_name': value.altSpellings,
          'idd': idd
        })

        return true;
      });
      this.items = data;
    }
  }
}
</script>

<template>
  <div class="container-sm mt-5 mb-2">

    <button type="button" id="btn-detailModal" class="btn d-none" data-bs-toggle="modal"
      data-bs-target="#detailModal"></button>
    <div class="modal fade" id="detailModal" tabindex="-1" aria-labelledby="detailModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content" v-if="Object.keys(detail).length > 0">
          <div class="modal-header">
            <h5 class="modal-title" id="detailModalLabel">
              <img :src="detail.flags.png" alt=""> {{detail.name.official}}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-html="text"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header text-center">
        <h1>Countries Catalog Implementation</h1>
      </div>

      <div class="card-body">
        <div class="row g-3 align-items-center mb-2">
          <div class="col-auto">
            <label for="inputSearch" class="col-form-label">Search</label>
          </div>
          <div class="col-auto">
            <input type="text" id="inputSearch" class="form-control" v-model="searchValue">
          </div>
        </div>
        <div class="card">
          <EasyDataTable buttons-pagination :headers="headers" :items="items" :search-value="searchValue"
            @click-row="clickDetail">
            <template #item-flag="{ flagURL , url}"><img :src="flagURL" style="width: 50px;" /></template>
            <template #loading><img src="https://i.pinimg.com/originals/94/fd/2b/94fd2bf50097ade743220761f41693d5.gif" style="width: 100px; height: 80px;"/></template>
          </EasyDataTable>
        </div>
      </div>
      <div class="card-footer">
        By Mr. Veth Suyngorn
        <span class="float-end">Thursday, 29<sup>th</sup> September 2022</span>
      </div>
    </div>
  </div>

</template>

<style scoped>
.modal-title img {
  width: 64px;
  margin-right: 15px;
}
</style>
