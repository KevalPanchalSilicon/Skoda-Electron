// import TimeFilter from "../component/TimeFilter";

const LocalGridConfig = {
	rowHeight: 40,
	headerHeight: 40,
	options: {
		animateRows: true,
		pagination: true,
		paginationPageSize: 50,
	},
	defaultColDef: {
		resizable: true,
		sortable: true,
		filter: "agTextColumnFilter",
		filterParams: {
			suppressAndOrCondition: true,
			// trimInput: true,
			// debounceMs: 2000
		},
		floatingFilter: true,
		minWidth: 200,
		flex: 1,
		cellClass: "custom__cell",
		// autoHeight: true,
		// rowHeight=60
		cellStyle: { textAlign: "center" },
	},
	components: {},
	columnTypes: {
		actionColumn: {
			cellRenderer: "ActionRenderer",
		},
	},
};

export default LocalGridConfig;
