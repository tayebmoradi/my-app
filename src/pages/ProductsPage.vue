<template>
  <q-page padding>
    <product-management
      :api-base-url="apiBaseUrl"
      :title="customTitle"
      :create-button-label="customCreateLabel"
      :no-image-text="customNoImageText"
      @created="showCreationNotification"
    >
      <template #header>
        <div class="row items-center q-mb-md custom-header">
          <div class="col">
            <h4 class="text-primary">{{ customTitle }}</h4>
            <div class="text-caption text-grey">
              {{ $t('productM') }}
            </div>
          </div>
          <div class="col-auto">
            <q-btn
              color="secondary"
              :label="customCreateLabel"
              icon="add"
              @click="$refs.productManagement.openCreate()"
            />
          </div>
        </div>
      </template>
    </product-management>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import ProductManagement from 'components/ProductManagement.vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'AdvancedProductsPage',

  components: {
    ProductManagement
  },

  setup() {
    const $q = useQuasar()
    const apiBaseUrl = 'https://localhost:7196/api'
    const productManagement = ref(null)

    const customTitle = 'محصولات فروشگاه'
    const customCreateLabel = 'افزودن محصول جدید'
    const customNoImageText = 'تصویر ندارد'

    const showCreationNotification = (product) => {
      $q.notify({
        type: 'positive',
        message: `محصول "${product.name}" با موفقیت اضافه شد`,
        position: 'top-right',
        timeout: 3000,
        actions: [
          { label: 'مشاهده', color: 'white', handler: () => {
            console.log('Show product:', product)
          }}
        ]
      })
    }

    return {
      apiBaseUrl,
      productManagement,
      customTitle,
      customCreateLabel,
      customNoImageText,
      showCreationNotification
    }
  }
})
</script>

<style scoped>
.custom-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 16px;
  margin-bottom: 24px;
}
</style>
