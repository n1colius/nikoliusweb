<template>
    <div class="columns">
        <v-dialog />

        <div class="column">&nbsp;</div>
		<div class="column is-four-fifths">
			<h2 class="title">Hero Data</h2>

            <!-- Form Begin -->
            <ValidationObserver v-slot="{ invalid }" ref="form">
            <form @submit.prevent="SubmitForm(invalid)">
                
                <input type="hidden" v-model="FormAction" />

                <ValidationProvider rules="required" v-slot="{ errors, classes }">
                <div class="field">
                    <label class="label">ID</label>
                    <div class="control">
                        <input class="input" type="text" placeholder="Hero ID" v-model="FormHeroID">
                    </div>
                    <p class="help is-danger">
                        {{ errors[0] }}
                    </p>
                </div>
                </ValidationProvider>

                <ValidationProvider rules="required" v-slot="{ errors, classes }">
                <div class="field">
                    <label class="label">Name</label>
                    <div class="control">
                        <input class="input" type="text" placeholder="Hero Name" v-model="FormHeroName">
                    </div>
                    <p class="help is-danger">
                        {{ errors[0] }}
                    </p>
                </div>
                </ValidationProvider>

                <ValidationProvider rules="required" v-slot="{ errors, classes }">
                <div class="field">
                    <label class="label">Picture</label>
                    <div class="control">
                        <input class="input" type="text" placeholder="Hero Picture" v-model="FormPicture">
                    </div>
                    <p class="help is-danger">
                        {{ errors[0] }}
                    </p>
                </div>
                </ValidationProvider>

                <ValidationProvider rules="required" v-slot="{ errors, classes }">
                <div class="field">
                    <label class="label">Primary Attribute</label>
                    <div class="control">
                        <select class="input" placeholder="Select Primary Attribute" v-model="FormPrimAttr">
                            <option value="str">Strengh</option>
                            <option value="agi">Agility</option>
                            <option value="int">intelligence</option>
                        </select>
                    </div>
                    <p class="help is-danger">
                        {{ errors[0] }}
                    </p>
                </div>
                </ValidationProvider>

                <ValidationProvider rules="required" v-slot="{ errors, classes }">
                <div class="field">
                    <label class="label">Attack Type</label>
                    <div class="control">
                        <select class="input" placeholder="Select Attack Type" v-model="FormAttackType">
                            <option value="Melee">Melee</option>
                            <option value="Ranged">Ranged</option>
                        </select>
                    </div>
                    <p class="help is-danger">
                        {{ errors[0] }}
                    </p>
                </div>
                </ValidationProvider>

                <ValidationProvider rules="required" v-slot="{ errors, classes }">
                <div class="field">
                    <label class="label">Roles</label>
                    <div class="control">
                        <label for="Carry" class="checkbox">
                            <input class="input-tags" type="checkbox" id="Carry" value="Carry" v-model="FormHeroRoles"> Carry
                        </label>
                        <label for="Escape" class="checkbox">
                            <input class="input-tags" type="checkbox" id="Escape" value="Escape" v-model="FormHeroRoles"> Escape
                        </label>
                        <label for="Nuker" class="checkbox">
                            <input class="input-tags" type="checkbox" id="Nuker" value="Nuker" v-model="FormHeroRoles"> Nuker
                        </label>
                        <label for="Initiator" class="checkbox">
                            <input class="input-tags" type="checkbox" id="Initiator" value="Initiator" v-model="FormHeroRoles"> Initiator
                        </label>
                        <label for="Durable" class="checkbox">
                            <input class="input-tags" type="checkbox" id="Durable" value="Durable" v-model="FormHeroRoles"> Durable
                        </label>
                        <label for="Disabler" class="checkbox">
                            <input class="input-tags" type="checkbox" id="Disabler" value="Disabler" v-model="FormHeroRoles"> Disabler
                        </label>
                        <label for="Jungler" class="checkbox">
                            <input class="input-tags" type="checkbox" id="Jungler" value="Jungler" v-model="FormHeroRoles"> Jungler
                        </label>
                        <label for="Support" class="checkbox">
                            <input class="input-tags" type="checkbox" id="Support" value="Support" v-model="FormHeroRoles"> Support
                        </label>
                        <label for="Pusher" class="checkbox">
                            <input class="input-tags" type="checkbox" id="Pusher" value="Pusher" v-model="FormHeroRoles"> Pusher
                        </label>
                    </div>
                    <p class="help is-danger">
                        {{ errors[0] }}
                    </p>
                </div>
                </ValidationProvider>


                <!-- Heroes Noted (Begin) -->
                <template v-if="FormAction == 'update'">
                    <br>
                    <h4 class="subtitle">Hero Notes</h4>

                    <div class="columns">
                        <div class="column">
                            <a
                                href="#"
                                class="button is-link is-small"
                                @click.prevent="TambahNotes()"
                                >Tambah Notes</a>
                        </div>
                        <div class="column is-6">&nbsp;</div>
                    </div>

                    <vue-good-table
                        :columns="ColumnsGrid"
                        :rows="RowsGrid">
                        <template slot="table-row" slot-scope="props">
                            <span v-if="props.column.field == 'action'">
                                <button
                                    class="button is-small is-primary"
                                    @click.prevent="UpdateNotes(props.row)"
                                >
                                    Update
                                </button>
                                <button
                                    class="button is-small is-danger"
                                    @click.prevent="DeleteNotes(props.row)"
                                >
                                    Delete
                                </button>
                            </span>
                        </template>
                    </vue-good-table>

                    <div id="PopupNotes" class="modal" v-bind:class="{'is-active': isActivePopupNotes}">
                        <div class="modal-background"></div>
                        <div class="modal-card">
                            <header class="modal-card-head">
                                <p class="modal-card-title">Notes Form</p>
                                <button @click.prevent="ClosePopup()" class="delete" aria-label="close"></button>
                            </header>
                            <section class="modal-card-body">
                                
                                <input type="hidden" v-model="PopupNotesID" />

                                <div class="field">
                                    <label class="label">Notes</label>
                                    <div class="control">
                                        <textarea class="input" type="text" placeholder="HeroNotes" v-model="PopupHeroNotes"></textarea>
                                    </div>
                                    <p class="help is-danger">
                                        {{ errors[0] }}
                                    </p>
                                </div>

                            </section>
                            <footer class="modal-card-foot">
                                <button @click.prevent="SaveHeroNotes()" class="button is-success">Save changes</button>
                                <button @click.prevent="ClosePopup()" class="button">Cancel</button>
                            </footer>
                        </div>
                    </div>
                </template>
                <!-- Heroes Noted (End) -->

                <br>
                <div class="field is-grouped">
                    <div class="control">
                        <button type="submit" class="button is-link">Submit</button>
                    </div>
                    <div class="control">
                        <button @click.prevent="BackToList()" class="button is-link is-light">Back</button>
                    </div>
                </div>

            </form>
            </ValidationObserver>
            <!-- Form End -->

        </div>
        <div class="column">&nbsp;</div>
    </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
    components: {
		ValidationProvider,
		ValidationObserver
	},
    middleware: 'authenticated',
    validate(context) {
        if(context.params.id == 'insert') {
            return true;
        } else if (Number.parseInt(context.params.id) > 0) {
            return true;
        } else {
            return false;
        }
    },
    data() {
        return {
            errors: "",
            classes: "",
            isActivePopupNotes: false,
            FormAction: "",
            FormHeroID: "",
            FormHeroName: "",
            FormPicture: "",
            FormPrimAttr: "",
            FormAttackType: "",
            FormHeroRoles: [],
            ColumnsGrid: [{
                label: "NotesID",
                field: "NotesID",
                type: "number",
                hidden: true
            },{
                label: "HeroID",
                field: "HeroID",
                type: "number",
                hidden: true
            },{
                label: "Notes",
                field: "Notes"
            },{
                label: "Action",
                field: "action",
                width: '175px'
			}],
            RowsGrid: [],
            PopupHeroNotes: "",
            PopupNotesID: ""
        }
    },
    async mounted() {
        const FormHeroID = Number.parseInt(this.$route.params.id);
        if (FormHeroID > 0) {
            this.FormAction = "update";

            //Isi formnya sini
            let response = await this.$axios.get("dota2heroes/form/"+FormHeroID);
            if(response.data.success == true) {
                this.FormHeroID = response.data.DataForm.HeroID;
                this.FormHeroName = response.data.DataForm.HeroName;
                this.FormPicture = response.data.DataForm.Picture;
                this.FormPrimAttr = response.data.DataForm.PrimAttr;
                this.FormAttackType = response.data.DataForm.AttackType;
                if(response.data.DataForm.HeroRoles != null) this.FormHeroRoles = response.data.DataForm.HeroRoles.split(',');

                this.LoadGridHeroNotes(); //load grid
            }
        } else {
            this.FormAction = "insert";
        }
    },
    methods: {
        async LoadGridHeroNotes() {
            try {
				//Ngeload grid
				const response = await this.$axios.get("dota2heroes/notesgrid", {
					params: {
                        HeroID: this.FormHeroID
                    }
				});
				this.RowsGrid = response.data.DataGrid;
			} catch (err) {
				this.$toast.show(
					'<img src="/images/error.png" width="24" />&nbsp;&nbsp;<p>Sorry, Server is busy</p>',
					{
						type: "error"
					}
				);
			}
        },
        async SubmitForm(invalid) {
            //trigger validation
            const valid = await this.$refs.form.validate();
            
            if(invalid == false) {
                try {
                    let response = await this.$axios.post("dota2heroes/isi", {
						FormAction: this.FormAction,
						FormHeroID: this.FormHeroID,
						FormHeroName: this.FormHeroName,
						FormPicture: this.FormPicture,
						FormPrimAttr: this.FormPrimAttr,
						FormAttackType: this.FormAttackType,
						FormHeroRoles: this.FormHeroRoles
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
							'<img src="/images/tick.png" width="24" />&nbsp;&nbsp;<p>Data Saved</p>',
							{
								type: "success"
							}
						);
						this.$router.push("/admin/dota2heroes"); //balik ke home
                    }

                } catch (err) {
                    this.$toast.show(
						'<img src="/images/error.png" width="24" />&nbsp;&nbsp;<p>Sorry, Server is busy</p>',
						{
							type: "error"
						}
					);
                }
            } else {
                this.$toast.show(
					'<img src="/images/info.png" width="24" />&nbsp;&nbsp;<p>Form is not valid yet</p>',
					{
						type: "info"
					}
				);
            }
        },
        BackToList() {
            this.$router.push("/admin/dota2heroes");
        },
        TambahNotes() {
            this.PopupNotesID = "";
            this.PopupHeroNotes = "";
            this.isActivePopupNotes = true; //show popup
        },
        async UpdateNotes(PropRow) {
            this.isActivePopupNotes = true; //show popup

            //Isi formnya sini
            let response = await this.$axios.get("dota2heroes/formnotes/"+PropRow.NotesID);
            this.PopupNotesID = response.data.DataForm.NotesID;
            this.PopupHeroNotes = response.data.DataForm.Notes;
        },
        DeleteNotes(PropRow) {
            this.$modal.show("dialog", {
				title: "Information",
				text: "Do your really want to delete this item ?",
				buttons: [{
					title: "Delete",
					handler: async () => {
                        this.$modal.hide("dialog");

                        try {
							let response = await this.$axios.post("dota2heroes/hapusnotes", {
								NotesID: PropRow.NotesID
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
								this.LoadGridHeroNotes(); //reload grid
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
        },
        async SaveHeroNotes() {
            try {
                let response = await this.$axios.post("dota2heroes/isinotes", {
                    FormHeroID: this.FormHeroID,
                    PopupNotesID: this.PopupNotesID,
                    PopupHeroNotes: this.PopupHeroNotes
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
                        '<img src="/images/tick.png" width="24" />&nbsp;&nbsp;<p>Data Saved</p>',
                        {
                            type: "success"
                        }
                    );
                    
                    this.isActivePopupNotes = false; //close popup
                    this.LoadGridHeroNotes(); //load grid
                }
            } catch(err) {
                this.$toast.show(
                    '<img src="/images/error.png" width="24" />&nbsp;&nbsp;<p>Sorry, Server is busy</p>',
                    {
                        type: "error"
                    }
                );
            }
        },
        ClosePopup() {
            this.isActivePopupNotes = false;
        }
    }
}
</script>

<style scoped></style>