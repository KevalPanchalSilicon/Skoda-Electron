const ServerGridConfig = {
	rowHeight: 40,
	headerHeight: 40,
	options: {
		rowModelType: "serverSide",
		animateRows: true,
		pagination: true,
		paginationPageSize: 500,
		cacheBlockSize: 500,
		rowHeight: 40,
		blockLoadDebounceMillis: 500,
	},
	defaultColDef: {
		resizable: true,
		sortable: true,
		filter: 'agTextColumnFilter',
		filterParams: {
			suppressAndOrCondition: true,
		},
		floatingFilter: true,
		minWidth: 200,
		flex: 1,
		cellStyle: { textAlign: "center" },
	},
	columnTypes: {
		actionColumn: {
			cellRenderer: 'ActionRenderer'
		},
	},
}

export default ServerGridConfig
