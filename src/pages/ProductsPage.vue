<template>
  <q-page padding>
    <!-- Header Section -->
    <div class="row items-center q-mb-md">
      <div class="col">
        <h5>مدیریت محصولات</h5>
      </div>
      <div class="col-auto">
        <q-btn color="primary" label="محصول جدید" icon="add" @click="openCreate" />
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
                no image
              </div>
            </q-td>
          </template>

          <!-- Actions Column -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="actions-cell">
              <q-btn dense round icon="edit" color="primary" @click="openEdit(props.row)" />
              <q-btn dense round icon="delete" color="negative" @click="confirmDelete(props.row)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Create/Edit Dialog -->
    <q-dialog v-model="formDialog">
      <q-card style="min-width: 420px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'ویرایش محصول' : 'افزودن محصول جدید' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="submitForm" ref="formRef">
            <q-input
              v-model="form.name"
              label="نام محصول"
              outlined
              dense
              lazy-rules
              :rules="[val => !!val || 'نام محصول الزامی است']"
            />

            <q-input
              v-model.number="form.price"
              label="قیمت"
              type="number"
              outlined
              dense
              lazy-rules
              class="q-mt-sm"
              :rules="[
                val => val !== null && val !== '' || 'قیمت الزامی است',
                val => val >= 0 || 'قیمت نمی‌تواند منفی باشد'
              ]"
            />

            <div class="q-mt-md">
              <div class="text-subtitle2 q-mb-xs">عکس محصول</div>

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
                label="کشیدن و رها کردن یا انتخاب فایل"
                @added="onFileAdded"
                max-files="1"
                auto-expand
                no-thumbnails
              />
            </div>

            <q-card-actions align="right" class="q-mt-md">
              <q-btn
                flat
                label="انصراف"
                color="secondary"
                @click="closeForm"
                :disable="saving"
              />
              <q-btn
                type="submit"
                label="ذخیره"
                color="primary"
                :loading="saving"
              />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const apiBaseUrl = 'https://localhost:7196/api'

    // State
    const products = ref([])
    const saving = ref(false)
    const formDialog = ref(false)
    const isEditing = ref(false)
    // const formRef = ref(null)
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
      return apiBaseUrl.replace('/api', '') + path
    }

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/products`)
        products.value = res.data
      } catch (err) {
        console.error('Error fetching products:', err)
        $q.notify({
          type: 'negative',
          message: 'خطا در دریافت لیست محصولات',
          position: 'top'
        })
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

   async function submitForm() {
  // اعتبارسنجی فرم
  // try {
  //   const isValid = await formRef.value.validate();
  //   if (!isValid) {
  //     $q.notify({
  //       type: 'negative',
  //       message: 'لطفاً تمام فیلدهای ضروری را به درستی پر کنید',
  //       position: 'top'
  //     });
  //     return;
  //   }
  // } catch (validationError) {
  //   console.error('Validation error:', validationError);
  //   return;
  // }

  saving.value = true;

  try {
    const formData = new FormData();
    formData.append('Name', form.name);
    formData.append('Price', form.price.toString());

    // مدیریت فایل آپلود شده
    if (fileItem.value) {
      const fileToUpload = fileItem.value.__file || fileItem.value;
      if (fileToUpload) {
        formData.append('Image', fileToUpload, fileToUpload.name);
      }
    }

    // ارسال درخواست به API
    let response;
    if (isEditing.value && form.id) {
      // ویرایش محصول موجود
      response = await axios.put(
        `${apiBaseUrl}/products/${form.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
    } else {
      // ایجاد محصول جدید
      response = await axios.post(
        `${apiBaseUrl}/products`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
    }

    // بررسی موفقیت آمیز بودن پاسخ
    if (response.status >= 200 && response.status < 300) {
      $q.notify({
        type: 'positive',
        message: isEditing.value
          ? 'محصول با موفقیت ویرایش شد'
          : 'محصول با موفقیت ایجاد شد',
        position: 'top',
        timeout: 2000
      });

      formDialog.value = false;
      await fetchProducts(); // تازه‌کردن لیست محصولات
    }
  } catch (error) {
    console.error('Error submitting form:', error);

    // مدیریت خطاها
    let errorMessage = 'خطا در ذخیره محصول';
    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = 'داده‌های ارسالی نامعتبر هستند';
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).join('\n');
      }
    }

    $q.notify({
      type: 'negative',
      message: errorMessage,
      position: 'top',
      timeout: 3000
    });
  } finally {
    saving.value = false;
  }
}
//     async function submitForm () {
//   saving.value = true
//   try {
//     const fd = new FormData()
//     fd.append('Name', form.name)
//     fd.append('Price', form.price)

//     if (fileItem.value) {
//       const nativeFile = fileItem.value.__file ?? fileItem.value
//       fd.append('Image', nativeFile, nativeFile.name)
//     }

//     if (isEditing.value && form.id) {
//       await axios.put(`${apiBaseUrl}/products/${form.id}`, fd, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       })
//       $q.notify({ type: 'positive', message: 'محصول با موفقیت ویرایش شد' })
//     } else {
//       await axios.post(`${apiBaseUrl}/products`, fd, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       })
//       $q.notify({ type: 'positive', message: 'محصول با موفقیت اضافه شد' })
//     }

//     formDialog.value = false
//     fetchProducts()
//   } catch (err) {
//     console.error(err)
//     $q.notify({ type: 'negative', message: 'خطا در ذخیره محصول' })
//   } finally {
//     saving.value = false
//   }
// }

    const closeForm = () => {
      if (!saving.value) {
        formDialog.value = false
      }
    }

    const confirmDelete = (product) => {
      $q.dialog({
        title: 'حذف محصول',
        message: `آیا از حذف "${product.name}" مطمئن هستید؟`,
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
          const response = await axios.delete(`${apiBaseUrl}/products/${product.id}`)

          if ([200, 204].includes(response.status)) {
            $q.notify({
              type: 'positive',
              message: 'محصول با موفقیت حذف شد',
              position: 'top'
            })

            products.value = products.value.filter(p => p.id !== product.id)
          }
        } catch (error) {
          console.error('Error deleting product:', error)
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





