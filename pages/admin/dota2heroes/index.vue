<template>
	<div class="columns">
        <v-dialog />

		<div class="column"></div>
		<div class="column is-four-fifths">
			<h2 class="title">Dota 2 - Heroes</h2>
			<h3 class="subtitle">Buat CRUD data dota heroes</h3>

            <div class="columns">
				<div class="column">
					<nuxt-link
						to="/admin/dota2heroes/insert"
						class="button is-link is-small"
						>Tambah Data</nuxt-link>
				</div>
				<div class="column is-6">
					<div class="field is-grouped">
						<p class="control is-expanded">
							<input
								class="input is-small"
								type="text"
								placeholder="Search by Name"
								v-model="serverParams.columnFilters.SearchName"
							/>
						</p>
						<p class="control">
							<a @click.prevent="onColumnFilter()" class="button is-small is-info">Search</a>
						</p>
					</div>
				</div>
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
					perPage: 25,
					position: 'bottom',
					perPageDropdown: [50, 100],
					dropdownAllowAll: false,
					setCurrentPage: 1,
					nextLabel: 'next',
					prevLabel: 'prev',
					rowsPerPageLabel: 'Rows per page',
					ofLabel: 'of',
					pageLabel: 'page',
					allLabel: 'All'
				}"
			>
				<template slot="table-row" slot-scope="props">
					<span v-if="props.column.field == 'action'">
						<button
							class="button is-small is-primary"
							@click.prevent="UpdateItem(props.row)"
						>
							Update
						</button>
						<button
							class="button is-small is-danger"
							@click.prevent="DeleteItem(props.row)"
						>
							Delete
						</button>
					</span>
				</template>
			</vue-good-table>

        </div>
        <div class="column"></div>

    </div>
</template>

<script>
export default {
    middleware: "authenticated",
    mounted() {
		//Load pertama
		this.LoadGridItems(); //load grid
	},
    data() {
		return {
			isLoading: false,
			totalRecords: 0,
			serverParams: {
				columnFilters: {
					SearchName: ""
				},
				sort: {
					field: "",
					type: ""
				},
				page: 1,
				perPage: 25
			},
			ColumnsGrid: [{
                label: "HeroID",
                field: "HeroID",
                type: "number"
            },{
                label: "Name",
                field: "HeroName"
            },{
                label: "Picture",
				field: "Picture",
				html: true,
				width:'150px'
            },{
				label: "Roles",
				field: "Roles"
			},{
                label: "Action",
				field: "action",
				width: '175px'
			}],
			RowsGrid: []
		};
    },
    methods: {
		async LoadGridItems() {
			this.isLoading = true;

			try {
				//Ngeload grid
				const response = await this.$axios.get("dota2heroes", {
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
			this.updateParams({ page: params.currentPage });
			this.LoadGridItems();
		},
		onPerPageChange(params) {
			this.updateParams({ perPage: params.currentPerPage });
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
		},
		UpdateItem(PropRow) {
			//console.log(PropRow);
			this.$router.push("/admin/dota2heroes/"+PropRow.HeroID);
		},
		DeleteItem(PropRow) {
			//console.log(PropRow);
			this.$modal.show("dialog", {
				title: "Information",
				text: "Do your really want to delete this item ?",
				buttons: [{
					title: "Delete",
					handler: async () => {
						this.$modal.hide("dialog");

						try {
							let response = await this.$axios.post("dota2heroes/hapus", {
								HeroID: PropRow.HeroID
							});

							if (response.data.success == false) {
								this.$toast.show(
									'<img src="/images/info.png" width="24" />&nbsp;&nbsp;<p>' +
										response.data.message +
										"</p>",
									{
										type: "info"
									}
								);
							} else {
								this.$toast.success(
									'<img src="/images/tick.png" width="24" />&nbsp;&nbsp;<p>Data Deleted</p>',
									{
										type: "success"
									}
								);
								this.LoadGridItems(); //reload grid
							}
						} catch (err) {
							this.$toast.show(
								'<img src="/images/error.png" width="24" />&nbsp;&nbsp;<p>Sorry, Server is busy</p>',
								{
									type: "error"
								}
							);
						}
					}
				},{
					title: "Cancel",
					default: true,
					handler: () => {
						this.$modal.hide("dialog");
					}
				}]
			});
		}        
    }
}
</script>

<style scoped></style>