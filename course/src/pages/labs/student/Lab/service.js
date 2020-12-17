import request from 'umi-request'

export async function fakeSubmitForm(params) {
  return request('/api/getLab', {
    method: 'POST',
    data: params,
  })
}
