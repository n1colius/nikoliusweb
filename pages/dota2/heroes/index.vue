<template>
	<div class="container pageblog">
        <h3 class="title is-2">Dota2 Heroes</h3>

        <div class="columns is-desktop">
            <div class="column">

                <div class="columns is-desktop">
                    <div class="column"></div>
                    <div class="column is-8">
                        <div class="field is-grouped">
                            <p class="control is-expanded">
                                <input
                                    class="input is-small"
                                    type="text"
                                    placeholder="Search by Hero Name"
                                    v-model="SearchHeroName"
                                />
                            </p>
                            <p class="control">
                                <a @click.prevent="SearchHeroes()" class="button is-small is-info">Search</a>
                            </p>
                        </div>
                    </div>
                </div>
                <br>

                <div class="columns is-desktop">
                    <div class="column">
                        <h3 class="subtitle">Strength Heroes</h3>

                        <div class="card" v-for="HeroStrSingle in HeroStr" :key="HeroStrSingle.HeroID">
                            <div class="card-content">
                                <div class="media">
                                    <div class="media-left">
                                        <figure class="image is-64x64">
                                            <img :src="HeroStrSingle.Picture">
                                        </figure>
                                    </div>
                                    <div class="media-content">
                                        <p class="title is-4">{{HeroStrSingle.HeroName}}</p>
                                        <p class="subtitle is-6"><strong class="CoAttack">Attack:</strong> {{HeroStrSingle.AttackType}} <br> <strong class="CoRoles">Roles:</strong> {{HeroStrSingle.Roles}}</p>
                                        <!-- Taruh langsung di querynya aja biar tidak ribet stylenya -->
                                    </div>
                                </div>

                                <div class="content">
                                    <p class="subtitle is-5">Notes</p>
                                    <ul class="HeroNotes" v-if="HeroStrSingle.Notes != null">
                                        <li v-for="note in HeroStrSingle.Notes.split('@@')" :key="note">
                                            {{note}}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div class="column">
                        <h3 class="subtitle">Agility Heroes</h3>

                        <div class="card" v-for="HeroAgiSingle in HeroAgi" :key="HeroAgiSingle.HeroID">
                            <div class="card-content">
                                <div class="media">
                                    <div class="media-left">
                                        <figure class="image is-64x64">
                                            <img :src="HeroAgiSingle.Picture">
                                        </figure>
                                    </div>
                                    <div class="media-content">
                                        <p class="title is-4">{{HeroAgiSingle.HeroName}}</p>
                                        <p class="subtitle is-6"><strong class="CoAttack">Attack:</strong> {{HeroAgiSingle.AttackType}} <br> <strong class="CoRoles">Roles:</strong> {{HeroAgiSingle.Roles}}</p>
                                        <!-- Taruh langsung di querynya aja biar tidak ribet stylenya -->
                                    </div>
                                </div>

                                <div class="content">
                                    <p class="subtitle is-5">Notes</p>
                                    <ul class="HeroNotes" v-if="HeroAgiSingle.Notes != null">
                                        <li v-for="note in HeroAgiSingle.Notes.split('@@')" :key="note">
                                            {{note}}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="column">
                        <h3 class="subtitle">intelligence Heroes</h3>

                        <div class="card" v-for="HeroIntSingle in HeroInt" :key="HeroIntSingle.HeroID">
                            <div class="card-content">
                                <div class="media">
                                    <div class="media-left">
                                        <figure class="image is-64x64">
                                            <img :src="HeroIntSingle.Picture">
                                        </figure>
                                    </div>
                                    <div class="media-content">
                                        <p class="title is-4">{{HeroIntSingle.HeroName}}</p>
                                        <p class="subtitle is-6"><strong class="CoAttack">Attack:</strong> {{HeroIntSingle.AttackType}} <br> <strong class="CoRoles">Roles:</strong> {{HeroIntSingle.Roles}}</p>
                                        <!-- Taruh langsung di querynya aja biar tidak ribet stylenya -->
                                    </div>
                                </div>

                                <div class="content">
                                    <p class="subtitle is-5">Notes</p>
                                    <ul class="HeroNotes" v-if="HeroIntSingle.Notes != null">
                                        <li v-for="note in HeroIntSingle.Notes.split('@@')" :key="note">
                                            {{note}}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
export default {
    middleware: ["redirectwww"],
    data() {
		return {
            SearchHeroName: "",
            HeroStr: [],
            HeroAgi: [],
            HeroInt: []
        }
    },
    async asyncData(context) {
		try {
            const [HeroStrRes,HeroAgiRes, HeroIntRes ] = await Promise.all([
                context.$axios.get("dota2heroes/displayhero", {
					params: {
                        HeroType: 'str',
						SearchHeroName: ""
					}
                }),
                context.$axios.get("dota2heroes/displayhero", {
					params: {
                        HeroType: 'agi',
						SearchHeroName: ""
					}
                }),
                context.$axios.get("dota2heroes/displayhero", {
					params: {
                        HeroType: 'int',
						SearchHeroName: ""
					}
				})
            ]);
            
            return {
                HeroStr: HeroStrRes.data.DataReturn,
                HeroAgi: HeroAgiRes.data.DataReturn,
                HeroInt: HeroIntRes.data.DataReturn
            }
		} catch (err) {
            console.log('err :>> ', err);
		}
	},
    methods: {
		async SearchHeroes() {
            try {
                const [HeroStrRes,HeroAgiRes, HeroIntRes ] = await Promise.all([
                    this.$axios.get("dota2heroes/displayhero", {
                        params: {
                            HeroType: 'str',
                            SearchHeroName: this.SearchHeroName
                        }
                    }),
                    this.$axios.get("dota2heroes/displayhero", {
                        params: {
                            HeroType: 'agi',
                            SearchHeroName: this.SearchHeroName
                        }
                    }),
                    this.$axios.get("dota2heroes/displayhero", {
                        params: {
                            HeroType: 'int',
                            SearchHeroName: this.SearchHeroName
                        }
                    })
                ]);
                
                this.HeroStr = HeroStrRes.data.DataReturn;
                this.HeroAgi = HeroAgiRes.data.DataReturn;
                this.HeroInt = HeroIntRes.data.DataReturn;
            } catch (err) {
                this.$toast.show(
					'<img src="/images/error.png" width="24" />&nbsp;&nbsp;<p>Sorry, Server is busy</p>',
					{
						type: "error"
					}
				);
            }    
        }
    }
}
</script>

<style scoped>
.CoAttack {
    color:blue;
}
.CoRoles {
    color:darkcyan;
}
.HeroNotes {
    margin-top:-15px;
}
.card {
    margin-bottom: 25px;
    min-width: 350px;
}
.HeroNotes li {
    font-size: 13px;
    line-height: 12px;
}
</style>