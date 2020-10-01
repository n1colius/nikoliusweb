<template>
	<div class="columns">
		<div class="column">&nbsp;</div>
		<div class="column is-four-fifths">
			

			<div class="columns">
				<div class="column is-6">
					<div class="field is-grouped">
						<p class="control is-expanded">
							<input class="input is-small" type="text" placeholder="Name Search" v-model="serverParams.columnFilters.SearchName">
						</p>
						<p class="control is-expanded">
							<input class="input is-small" type="text" placeholder="Email Search" v-model="serverParams.columnFilters.SearchEmail">
						</p>
						<p class="control">
							<a @click.prevent="onColumnFilter()" class="button is-small is-info">Search</a>
						</p>
					</div>
				</div>
				<div class="column">&nbsp;</div>
			</div>

			<vue-good-table
				mode="remote"
				@on-page-change="onPageChange"
				@on-sort-change="onSortChange"
				@on-column-filter="onColumnFilter"
				@on-per-page-change="onPerPageChange"
				:totalRows="totalRecords"
				:isLoading.sync="isLoading"
				:columns="ColumnsGrid"
				:rows="RowsGrid"
				:pagination-options="{
					enabled: true,
					mode: 'records',
					perPage: 10,
					position: 'bottom',
					perPageDropdown: [25, 50],
					dropdownAllowAll: false,
					setCurrentPage: 1,
					nextLabel: 'next',
					prevLabel: 'prev',
					rowsPerPageLabel: 'Rows per page',
					ofLabel: 'of',
					pageLabel: 'page',
					allLabel: 'All',
				}"
			/>
			<br>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci nihil, alias nesciunt, non perspiciatis labore quaerat mollitia explicabo doloribus asperiores excepturi! Molestias exercitationem nam, error nostrum odit praesentium ut sunt!</p>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci nihil, alias nesciunt, non perspiciatis labore quaerat mollitia explicabo doloribus asperiores excepturi! Molestias exercitationem nam, error nostrum odit praesentium ut sunt!</p>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci nihil, alias nesciunt, non perspiciatis labore quaerat mollitia explicabo doloribus asperiores excepturi! Molestias exercitationem nam, error nostrum odit praesentium ut sunt!</p>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci nihil, alias nesciunt, non perspiciatis labore quaerat mollitia explicabo doloribus asperiores excepturi! Molestias exercitationem nam, error nostrum odit praesentium ut sunt!</p>
		</div>
		<div class="column">&nbsp;</div>
	</div>
</template>

<script>
export default {
	mounted() {
		//Load pertama
		this.LoadGridItems(); //load grid
	},
	data(){
		return {
			isLoading: false,
			totalRecords: 0,
			serverParams: {
				columnFilters: {
					SearchName: '',
					SearchEmail: ''
				},
				sort: {
					field: '', 
					type: '',
				},
				page: 1, 
				perPage: 10
			},
			ColumnsGrid: [{
				label: 'ID',
				field: 'id',
				type:'number'
			},{
				label: 'First Name',
				field: 'first_name'
			},{
				label: 'Last Name',
				field: 'last_name'
			},{
				label: 'Email',
				field: 'email'
			},{
				label: 'Birthdate',
				field: 'birthdate',
				type:'date',
				dateInputFormat: 'yyyy-MM-dd', // expects 2018-03-16
    			dateOutputFormat: 'do MMM yyyy' // outputs Mar 16th 2018
			},{
				label: 'Timestamp',
				field: 'added',
				type:'date',
				dateInputFormat: 'yyyy-MM-dd H:m:s', // expects 2018-03-16
    			dateOutputFormat: 'do MMM yyyy H:m' // outputs Mar 16th 2018
			}],
			RowsGrid: []
		};
	},
	methods: {
		async LoadGridItems() {
			this.isLoading =  true;
			console.log('serverParams');
			console.log(this.serverParams);
			try {
				//Ngeload grid
				const response = await this.$axios.get("authen/menu_admin_coba", {
					params: this.serverParams
				});
				this.RowsGrid = response.data.DataGrid;
				this.totalRecords = response.data.TotalRows;
				this.isLoading = false;
			} catch (err) {
				this.$toast.show(
					'<img src="/images/error.png" width="24" />&nbsp;&nbsp;<p>Sorry, Server is busy</p>',
					{
						type: "error"
					}
				);
				this.isLoading = false;
			}
		},
		updateParams(newProps) {
			this.serverParams = Object.assign({}, this.serverParams, newProps);
		},
		onPageChange(params) {
			this.updateParams({page: params.currentPage});
			this.LoadGridItems();
		},
		onPerPageChange(params) {
			this.updateParams({perPage: params.currentPerPage});
			this.LoadGridItems();
		},
		onSortChange(params) {
			this.updateParams({
				sort: params
			});
			this.LoadGridItems();
		},
		onColumnFilter() {
			this.LoadGridItems();
		}
	}
};
</script>

<style scoped>
</style>