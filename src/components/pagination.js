import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    let pageCount;

    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        // переносим код, который делали под @todo: #2.6
        if (action) switch(action.name) {
            case 'prev': page = Math.max(1, page - 1); break;
            case 'next': page = pageCount ? Math.min(pageCount, page + 1) : page + 1; break;
            case 'first': page = 1; break;
            case 'last': page = pageCount || page; break;
        }

        return Object.assign({}, query, {
            limit,
            page
        });
    }

    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit);

        // переносим код, который делали под @todo: #2.4
        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === page);
        }))
        // переносим код, который делали под @todo: #2.5 (rowsPerPage -> limit)
        totalRows.textContent = total;
        fromRow.textContent = total ? (page - 1) * limit + 1 : 0;
        toRow.textContent = Math.min((page * limit), total);
    }

    return {
        updatePagination,
        applyPagination
    };
}