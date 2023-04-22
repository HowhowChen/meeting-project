const DEFAULT_PAGINATOR_NAVBAR_START = 1 //  分頁導覽列從第一頁開始(固定)
const PAGINATOR_NAVBAR_COUNT = 5 //  分頁導覽列顯示數量
const MIDDLE_PAGINATOR_NAVBAR_COUNT = 3 //  導覽列中間頁數量
const MIDDLE_PAGINATOR_NAVBAR_RANGE_STAY_PAGE = 2 // 在超過中間頁後導覽列向前、後保持頁數
const LAST_PAGINATOR_NAVBAR_STAY_PAGE = 4 // 在最尾頁時，導覽列向前保持頁數

const getOffset = (limit = 10, page = 1) => (page - 1) * limit
const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPage = Math.ceil(total / limit)
  // const pages = Array.from({ length: totalPage }, (_, index) => index + 1)
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1
  const pages = fivePages(currentPage, totalPage)
  return {
    pages,
    totalPage,
    currentPage,
    prev,
    next
  }
}

//  組成首頁分頁導覽列
function fivePages (currentPage, totalPage) {
  const pages = []
  let startPage = DEFAULT_PAGINATOR_NAVBAR_START
  let maxLastPage = totalPage

  if (totalPage > PAGINATOR_NAVBAR_COUNT) {
    if (currentPage <= MIDDLE_PAGINATOR_NAVBAR_COUNT) {
      startPage = DEFAULT_PAGINATOR_NAVBAR_START
      maxLastPage = PAGINATOR_NAVBAR_COUNT
    } else if ((currentPage + DEFAULT_PAGINATOR_NAVBAR_START) === totalPage) {
      startPage = currentPage - MIDDLE_PAGINATOR_NAVBAR_COUNT
      maxLastPage = currentPage + DEFAULT_PAGINATOR_NAVBAR_START
    } else if (currentPage === totalPage) {
      startPage = currentPage - LAST_PAGINATOR_NAVBAR_STAY_PAGE
      maxLastPage = totalPage
    } else if (currentPage > MIDDLE_PAGINATOR_NAVBAR_COUNT) {
      startPage = currentPage - MIDDLE_PAGINATOR_NAVBAR_RANGE_STAY_PAGE
      maxLastPage = currentPage + MIDDLE_PAGINATOR_NAVBAR_RANGE_STAY_PAGE
    }
  }

  for (let i = startPage; i <= maxLastPage; i++) {
    pages.push({
      page: i
    })
  }
  return pages
}

module.exports = {
  getOffset,
  getPagination
}
