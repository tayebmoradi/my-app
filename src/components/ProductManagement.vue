<template>
  <div class="product-management">
    <!-- Header Section -->
    <div class="row items-center q-mb-md">
      <div class="col">
        <h5>{{ title }}</h5>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          :label="createButtonLabel"
          icon="add"
          @click="openCreate"
        />
      </div>
    </div>

    <!-- Products Table -->
    <q-card>
      <q-card-section>
        <q-table
          :rows="products"
          :columns="columns"
          row-key="id"
          flat
          dense
          bordered
          :loading="loading"
        >
          <!-- Product Image Column -->
          <template v-slot:body-cell-image="props">
            <q-td :props="props">
              <img
                v-if="props.row.imagePath"
                :src="formatImageUrl(props.row.imagePath)"
                class="product-image"
                alt="product"
              />
              <div v-else class="no-image">
                {{ noImageText }}
              </div>
            </q-td>
          </template>

          <!-- Actions Column -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="actions-cell">
              <q-btn
                dense
                round
                icon="edit"
                color="primary"
                @click="openEdit(props.row)"
              />
              <q-btn
                dense
                round
                icon="delete"
                color="negative"
                @click="confirmDelete(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Create/Edit Dialog -->
    <q-dialog v-model="formDialog">
      <q-card style="min-width: 420px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? editTitle : createTitle }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="submitForm">
            <q-input
              v-model="form.name"
              :label="nameLabel"
              outlined
              dense
              lazy-rules
              :rules="[val => !!val || nameRequiredMessage]"
            />

            <q-input
              v-model.number="form.price"
              :label="priceLabel"
              type="number"
              outlined
              dense
              lazy-rules
              class="q-mt-sm"
              :rules="[
                val => val !== null && val !== '' || priceRequiredMessage,
                val => val >= 0 || priceNegativeMessage
              ]"
            />

            <div class="q-mt-md">
              <div class="text-subtitle2 q-mb-xs">{{ imageLabel }}</div>

              <div v-if="preview" class="q-mb-sm preview-container">
                <img :src="preview" class="preview-image" />
                <q-btn
                  flat
                  round
                  dense
                  icon="close"
                  class="preview-remove-btn"
                  @click="removePreview"
                  aria-label="remove"
                />
              </div>

              <q-uploader
                ref="uploaderRef"
                :hide-upload-btn="true"
                accept="image/*"
                :label="uploaderLabel"
                @added="onFileAdded"
                max-files="1"
                auto-expand
                no-thumbnails
              />
            </div>

            <q-card-actions align="right" class="q-mt-md">
              <q-btn
                flat
                :label="cancelButtonLabel"
                color="secondary"
                @click="closeForm"
                :disable="saving"
              />
              <q-btn
                type="submit"
                :label="saveButtonLabel"
                color="primary"
                :loading="saving"
              />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'

export default {
  name: 'ProductManagement',

  props: {
    apiBaseUrl: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: 'مدیریت محصولات'
    },
    createButtonLabel: {
      type: String,
      default: 'محصول جدید'
    },
    noImageText: {
      type: String,
      default: 'بدون تصویر'
    },
    createTitle: {
      type: String,
      default: 'افزودن محصول جدید'
    },
    editTitle: {
      type: String,
      default: 'ویرایش محصول'
    },
    nameLabel: {
      type: String,
      default: 'نام محصول'
    },
    nameRequiredMessage: {
      type: String,
      default: 'نام محصول الزامی است'
    },
    priceLabel: {
      type: String,
      default: 'قیمت'
    },
    priceRequiredMessage: {
      type: String,
      default: 'قیمت الزامی است'
    },
    priceNegativeMessage: {
      type: String,
      default: 'قیمت نمی‌تواند منفی باشد'
    },
    imageLabel: {
      type: String,
      default: 'عکس محصول'
    },
    uploaderLabel: {
      type: String,
      default: 'کشیدن و رها کردن یا انتخاب فایل'
    },
    cancelButtonLabel: {
      type: String,
      default: 'انصراف'
    },
    saveButtonLabel: {
      type: String,
      default: 'ذخیره'
    },
    deleteConfirmMessage: {
      type: String,
      default: 'آیا از حذف این محصول مطمئن هستید؟'
    },
    deleteSuccessMessage: {
      type: String,
      default: 'محصول با موفقیت حذف شد'
    },
    createSuccessMessage: {
      type: String,
      default: 'محصول با موفقیت ایجاد شد'
    },
    updateSuccessMessage: {
      type: String,
      default: 'محصول با موفقیت ویرایش شد'
    }
  },

  emits: ['created', 'updated', 'deleted', 'error'],

  setup(props, { emit }) {
    const $q = useQuasar()

    // State
    const products = ref([])
    const loading = ref(false)
    const saving = ref(false)
    const formDialog = ref(false)
    const isEditing = ref(false)
    const uploaderRef = ref(null)
    const fileItem = ref(null)
    const preview = ref(null)

    // Form Data
    const form = reactive({
      id: null,
      name: '',
      price: 0,
      imagePath: null
    })

    // Table Columns
    const columns = [
      { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
      { name: 'image', label: 'عکس', field: 'imagePath', align: 'center' },
      { name: 'name', label: 'نام', field: 'name', align: 'right', sortable: true },
      { name: 'price', label: 'قیمت', field: 'price', align: 'right', sortable: true },
      { name: 'actions', label: 'عملیات', field: 'actions', align: 'center' }
    ]

    // Methods
    const formatImageUrl = (path) => {
      if (!path) return ''
      if (path.startsWith('http')) return path
      return props.apiBaseUrl.replace('/api', '') + path
    }

    const fetchProducts = async () => {
      loading.value = true
      try {
        const res = await axios.get(`${props.apiBaseUrl}/products`)
        products.value = res.data
      } catch (err) {
        console.error('Error fetching products:', err)
        emit('error', err)
        $q.notify({
          type: 'negative',
          message: 'خطا در دریافت لیست محصولات',
          position: 'top'
        })
      } finally {
        loading.value = false
      }
    }

    const openCreate = () => {
      isEditing.value = false
      resetForm()
      formDialog.value = true
    }

    const openEdit = (product) => {
      isEditing.value = true
      Object.assign(form, {
        id: product.id,
        name: product.name,
        price: product.price,
        imagePath: product.imagePath
      })
      preview.value = formatImageUrl(product.imagePath)
      formDialog.value = true
    }

    const resetForm = () => {
      Object.assign(form, {
        id: null,
        name: '',
        price: 0,
        imagePath: null
      })
      preview.value = null
      fileItem.value = null
      if (uploaderRef.value) {
        uploaderRef.value.reset()
      }
    }

    const onFileAdded = (files) => {
      if (files && files.length) {
        fileItem.value = files[0]
        preview.value = URL.createObjectURL(files[0])
      }
    }

    const removePreview = () => {
      if (preview.value) {
        URL.revokeObjectURL(preview.value)
      }
      preview.value = null
      fileItem.value = null
      if (uploaderRef.value) {
        uploaderRef.value.reset()
      }
    }

    const submitForm = async () => {
      saving.value = true
      try {
        const formData = new FormData()
        formData.append('Name', form.name)
        formData.append('Price', form.price.toString())

        if (fileItem.value) {
          const fileToUpload = fileItem.value.__file || fileItem.value
          if (fileToUpload) {
            formData.append('Image', fileToUpload, fileToUpload.name)
          }
        }

        let response
        if (isEditing.value && form.id) {
          response = await axios.put(
            `${props.apiBaseUrl}/products/${form.id}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          )
          $q.notify({
            type: 'positive',
            message: props.updateSuccessMessage,
            position: 'top'
          })
          emit('updated', response.data)
        } else {
          response = await axios.post(
            `${props.apiBaseUrl}/products`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          )
          $q.notify({
            type: 'positive',
            message: props.createSuccessMessage,
            position: 'top'
          })
          emit('created', response.data)
        }

        formDialog.value = false
        await fetchProducts()
      } catch (error) {
        console.error('Error submitting form:', error)
        emit('error', error)

        let errorMessage = 'خطا در ذخیره محصول'
        if (error.response) {
          if (error.response.status === 400) {
            errorMessage = 'داده‌های ارسالی نامعتبر هستند'
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message
          } else if (error.response.data?.errors) {
            errorMessage = Object.values(error.response.data.errors).join('\n')
          }
        }

        $q.notify({
          type: 'negative',
          message: errorMessage,
          position: 'top'
        })
      } finally {
        saving.value = false
      }
    }

    const closeForm = () => {
      if (!saving.value) {
        formDialog.value = false
      }
    }

    const confirmDelete = (product) => {
      $q.dialog({
        title: 'حذف محصول',
        message: `${props.deleteConfirmMessage} "${product.name}"?`,
        persistent: true,
        ok: {
          label: 'حذف',
          color: 'negative'
        },
        cancel: {
          label: 'انصراف',
          color: 'primary'
        }
      }).onOk(async () => {
        try {
          const response = await axios.delete(`${props.apiBaseUrl}/products/${product.id}`)

          if ([200, 204].includes(response.status)) {
            $q.notify({
              type: 'positive',
              message: props.deleteSuccessMessage,
              position: 'top'
            })

            products.value = products.value.filter(p => p.id !== product.id)
            emit('deleted', product.id)
          }
        } catch (error) {
          console.error('Error deleting product:', error)
          emit('error', error)
          $q.notify({
            type: 'negative',
            message: error.response?.data?.message || 'خطا در حذف محصول',
            position: 'top'
          })
        }
      })
    }

    // Lifecycle Hook
    onMounted(() => {
      fetchProducts()
    })

    return {
      products,
      columns,
      formDialog,
      form,
      preview,
      saving,
      loading,
      formatImageUrl,
      openCreate,
      openEdit,
      onFileAdded,
      removePreview,
      submitForm,
      closeForm,
      confirmDelete
    }
  }
}
</script>

<style scoped>
.product-management {
  width: 100%;
}

.product-image {
  max-width: 72px;
  max-height: 72px;
  object-fit: cover;
  border-radius: 6px;
}

.no-image {
  width: 72px;
  height: 72px;
  border-radius: 6px;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.actions-cell {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.preview-container {
  position: relative;
  display: inline-block;
}

.preview-image {
  max-width: 200px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.preview-remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(255, 255, 255, 0.7);
}

.q-table th {
  text-align: right;
  font-weight: bold;
}

.q-table__container {
  border-radius: 8px;
}
</style>
