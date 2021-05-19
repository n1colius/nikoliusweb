<template>
    <div class="container pageblog">
        <h3 class="title is-2">Match Analysis</h3>

        <div class="columns is-desktop">
            <div class="column">

                
                <div class="field is-fullwidth">
                    <label class="label">Radiant Heroes</label>
                    <div class="control">
                        <p class="control is-expanded">
                            <client-only>
                                <multiselect v-model="RadiantHeroSearchValue" tag-placeholder="Add hero to search" placeholder="Search hero" label="CmbHeroName" track-by="CmbHeroID" :options="RadiantCmbHeroes" :multiple="true" :taggable="true" @tag="addSearchHeroRadiant"></multiselect>
                            </client-only>
                        </p>
                    </div>
                </div>

                <br>

                <div class="field">
                    <label class="label">Dire Heroes</label>
                    <div class="control">
                        <p class="control is-expanded">
                            <client-only>
                                <multiselect v-model="DireHeroSearchValue" tag-placeholder="Add hero to search" placeholder="Search hero" label="CmbHeroName" track-by="CmbHeroID" :options="DireCmbHeroes" :multiple="true" :taggable="true" @tag="addSearchHeroDire"></multiselect>
                            </client-only>
                        </p>
                    </div>
                </div>

                <br>

                <div class="field is-grouped">
                    <div class="control">
                        <button @click.prevent="AnalyzeMatch()" class="button is-link">Analyze</button>
                    </div>
                </div>

                <div class="columns is-desktop">
                    <div class="column">

                        <p>
                            <strong class="CoRed">*</strong> Data is based on Competitive matches. Crawl manually from DotaAPI. Source data will be updated periodically depends on i'm busy or not i guess.
                            <br>
                            <nuxt-link to="/dota2/matchana/listleague" class="is-link is-small">View match analysis data</nuxt-link>
                        </p>

                        <br><br>

                        <div v-show="isSearch">

                            <h2 class="subtitlecustom1"><strong class="CoGreen">RADIANT HEROES</strong></h2>
                            <div class="columns is-desktop">
                                <div class="column">

                                    <div class="card">
                                        <div class="card-content">
                                            <div class="media">
                                                <div class="media-left">
                                                    <figure class="image is-64x64">
                                                        <img :src="ObjRadiant1[0].Picture">
                                                    </figure>
                                                </div>
                                                <div class="media-content">
                                                    <p class="title is-4">{{ObjRadiant1[0].Hero}}</p>
                                                </div>
                                            </div>

                                            <div class="content">
                                                <p class="subtitle is-5">Winrate</p>
                                                <ul class="HeroNotes">
                                                    <li><strong>{{ObjRadiant1[0].HeroAgainst}}</strong> - {{ObjRadiant1[0].WinRate}}% ({{ObjRadiant1[0].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjRadiant1[1].HeroAgainst}}</strong> - {{ObjRadiant1[1].WinRate}}% ({{ObjRadiant1[1].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjRadiant1[2].HeroAgainst}}</strong> - {{ObjRadiant1[2].WinRate}}% ({{ObjRadiant1[2].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjRadiant1[3].HeroAgainst}}</strong> - {{ObjRadiant1[3].WinRate}}% ({{ObjRadiant1[3].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjRadiant1[4].HeroAgainst}}</strong> - {{ObjRadiant1[4].WinRate}}% ({{ObjRadiant1[4].TotalMatch}} games)</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div class="column">

                                    <div class="card">
                                        <div class="card-content">
                                            <div class="media">
                                                <div class="media-left">
                                                    <figure class="image is-64x64">
                                                        <img :src="ObjRadiant2[0].Picture">
                                                    </figure>
                                                </div>
                                                <div class="media-content">
                                                    <p class="title is-4">{{ObjRadiant2[0].Hero}}</p>
                                                </div>
                                            </div>

                                            <div class="content">
                                                <p class="subtitle is-5">Winrate</p>
                                                <ul class="HeroNotes">
                                                    <li><strong>{{ObjRadiant2[0].HeroAgainst}}</strong> - {{ObjRadiant2[0].WinRate}}% ({{ObjRadiant2[0].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjRadiant2[1].HeroAgainst}}</strong> - {{ObjRadiant2[1].WinRate}}% ({{ObjRadiant2[1].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjRadiant2[2].HeroAgainst}}</strong> - {{ObjRadiant2[2].WinRate}}% ({{ObjRadiant2[2].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjRadiant2[3].HeroAgainst}}</strong> - {{ObjRadiant2[3].WinRate}}% ({{ObjRadiant2[3].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjRadiant2[4].HeroAgainst}}</strong> - {{ObjRadiant2[4].WinRate}}% ({{ObjRadiant2[4].TotalMatch}} games)</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div class="column">

                                    <div class="card">
                                        <div class="card-content">
                                            <div class="media">
                                                <div class="media-left">
                                                    <figure class="image is-64x64">
                                                        <img :src="ObjRadiant3[0].Picture">
                                                    </figure>
                                                </div>
                                                <div class="media-content">
                                                    <p class="title is-4">{{ObjRadiant3[0].Hero}}</p>
                                                </div>
                                            </div>

                                            <div class="content">
                                                <p class="subtitle is-5">Winrate</p>
                                                <ul class="HeroNotes">
                                                    <li><strong>{{ObjRadiant3[0].HeroAgainst}}</strong> - {{ObjRadiant3[0].WinRate}}% ({{ObjRadiant3[0].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjRadiant3[1].HeroAgainst}}</strong> - {{ObjRadiant3[1].WinRate}}% ({{ObjRadiant3[1].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjRadiant3[2].HeroAgainst}}</strong> - {{ObjRadiant3[2].WinRate}}% ({{ObjRadiant3[2].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjRadiant3[3].HeroAgainst}}</strong> - {{ObjRadiant3[3].WinRate}}% ({{ObjRadiant3[3].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjRadiant3[4].HeroAgainst}}</strong> - {{ObjRadiant3[4].WinRate}}% ({{ObjRadiant3[4].TotalMatch}} games)</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <br>
                            <div class="columns is-desktop">
                                <div class="column">

                                    <div class="card">
                                        <div class="card-content">
                                            <div class="media">
                                                <div class="media-left">
                                                    <figure class="image is-64x64">
                                                        <img :src="ObjRadiant4[0].Picture">
                                                    </figure>
                                                </div>
                                                <div class="media-content">
                                                    <p class="title is-4">{{ObjRadiant4[0].Hero}}</p>
                                                </div>
                                            </div>

                                            <div class="content">
                                                <p class="subtitle is-5">Winrate</p>
                                                <ul class="HeroNotes">
                                                    <li><strong>{{ObjRadiant4[0].HeroAgainst}}</strong> - {{ObjRadiant4[0].WinRate}}% ({{ObjRadiant4[0].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjRadiant4[1].HeroAgainst}}</strong> - {{ObjRadiant4[1].WinRate}}% ({{ObjRadiant4[1].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjRadiant4[2].HeroAgainst}}</strong> - {{ObjRadiant4[2].WinRate}}% ({{ObjRadiant4[2].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjRadiant4[3].HeroAgainst}}</strong> - {{ObjRadiant4[3].WinRate}}% ({{ObjRadiant4[3].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjRadiant4[4].HeroAgainst}}</strong> - {{ObjRadiant4[4].WinRate}}% ({{ObjRadiant4[4].TotalMatch}} games)</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div class="column">

                                    <div class="card">
                                        <div class="card-content">
                                            <div class="media">
                                                <div class="media-left">
                                                    <figure class="image is-64x64">
                                                        <img :src="ObjRadiant5[0].Picture">
                                                    </figure>
                                                </div>
                                                <div class="media-content">
                                                    <p class="title is-4">{{ObjRadiant5[0].Hero}}</p>
                                                </div>
                                            </div>

                                            <div class="content">
                                                <p class="subtitle is-5">Winrate</p>
                                                <ul class="HeroNotes">
                                                    <li><strong>{{ObjRadiant5[0].HeroAgainst}}</strong> - {{ObjRadiant5[0].WinRate}}% ({{ObjRadiant5[0].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjRadiant5[1].HeroAgainst}}</strong> - {{ObjRadiant5[1].WinRate}}% ({{ObjRadiant5[1].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjRadiant5[2].HeroAgainst}}</strong> - {{ObjRadiant5[2].WinRate}}% ({{ObjRadiant5[2].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjRadiant5[3].HeroAgainst}}</strong> - {{ObjRadiant5[3].WinRate}}% ({{ObjRadiant5[3].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjRadiant5[4].HeroAgainst}}</strong> - {{ObjRadiant5[4].WinRate}}% ({{ObjRadiant5[4].TotalMatch}} games)</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <br><br>

                            <h2 class="subtitlecustom1"><strong class="CoRed">DIRE HEROES</strong></h2>
                            <div class="columns is-desktop">
                                <div class="column">

                                    <div class="card">
                                        <div class="card-content">
                                            <div class="media">
                                                <div class="media-left">
                                                    <figure class="image is-64x64">
                                                        <img :src="ObjDire1[0].Picture">
                                                    </figure>
                                                </div>
                                                <div class="media-content">
                                                    <p class="title is-4">{{ObjDire1[0].Hero}}</p>
                                                </div>
                                            </div>

                                            <div class="content">
                                                <p class="subtitle is-5">Winrate</p>
                                                <ul class="HeroNotes">
                                                    <li><strong>{{ObjDire1[0].HeroAgainst}}</strong> - {{ObjDire1[0].WinRate}}% ({{ObjDire1[0].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjDire1[1].HeroAgainst}}</strong> - {{ObjDire1[1].WinRate}}% ({{ObjDire1[1].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjDire1[2].HeroAgainst}}</strong> - {{ObjDire1[2].WinRate}}% ({{ObjDire1[2].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjDire1[3].HeroAgainst}}</strong> - {{ObjDire1[3].WinRate}}% ({{ObjDire1[3].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjDire1[4].HeroAgainst}}</strong> - {{ObjDire1[4].WinRate}}% ({{ObjDire1[4].TotalMatch}} games)</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div class="column">

                                    <div class="card">
                                        <div class="card-content">
                                            <div class="media">
                                                <div class="media-left">
                                                    <figure class="image is-64x64">
                                                        <img :src="ObjDire2[0].Picture">
                                                    </figure>
                                                </div>
                                                <div class="media-content">
                                                    <p class="title is-4">{{ObjDire2[0].Hero}}</p>
                                                </div>
                                            </div>

                                            <div class="content">
                                                <p class="subtitle is-5">Winrate</p>
                                                <ul class="HeroNotes">
                                                    <li><strong>{{ObjDire2[0].HeroAgainst}}</strong> - {{ObjDire2[0].WinRate}}% ({{ObjDire2[0].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjDire2[1].HeroAgainst}}</strong> - {{ObjDire2[1].WinRate}}% ({{ObjDire2[1].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjDire2[2].HeroAgainst}}</strong> - {{ObjDire2[2].WinRate}}% ({{ObjDire2[2].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjDire2[3].HeroAgainst}}</strong> - {{ObjDire2[3].WinRate}}% ({{ObjDire2[3].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjDire2[4].HeroAgainst}}</strong> - {{ObjDire2[4].WinRate}}% ({{ObjDire2[4].TotalMatch}} games)</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div class="column">

                                    <div class="card">
                                        <div class="card-content">
                                            <div class="media">
                                                <div class="media-left">
                                                    <figure class="image is-64x64">
                                                        <img :src="ObjDire3[0].Picture">
                                                    </figure>
                                                </div>
                                                <div class="media-content">
                                                    <p class="title is-4">{{ObjDire3[0].Hero}}</p>
                                                </div>
                                            </div>

                                            <div class="content">
                                                <p class="subtitle is-5">Winrate</p>
                                                <ul class="HeroNotes">
                                                    <li><strong>{{ObjDire3[0].HeroAgainst}}</strong> - {{ObjDire3[0].WinRate}}% ({{ObjDire3[0].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjDire3[1].HeroAgainst}}</strong> - {{ObjDire3[1].WinRate}}% ({{ObjDire3[1].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjDire3[2].HeroAgainst}}</strong> - {{ObjDire3[2].WinRate}}% ({{ObjDire3[2].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjDire3[3].HeroAgainst}}</strong> - {{ObjDire3[3].WinRate}}% ({{ObjDire3[3].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjDire3[4].HeroAgainst}}</strong> - {{ObjDire3[4].WinRate}}% ({{ObjDire3[4].TotalMatch}} games)</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <br>
                            <div class="columns is-desktop">
                                <div class="column">

                                    <div class="card">
                                        <div class="card-content">
                                            <div class="media">
                                                <div class="media-left">
                                                    <figure class="image is-64x64">
                                                        <img :src="ObjDire4[0].Picture">
                                                    </figure>
                                                </div>
                                                <div class="media-content">
                                                    <p class="title is-4">{{ObjDire4[0].Hero}}</p>
                                                </div>
                                            </div>

                                            <div class="content">
                                                <p class="subtitle is-5">Winrate</p>
                                                <ul class="HeroNotes">
                                                    <li><strong>{{ObjDire4[0].HeroAgainst}}</strong> - {{ObjDire4[0].WinRate}}% ({{ObjDire4[0].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjDire4[1].HeroAgainst}}</strong> - {{ObjDire4[1].WinRate}}% ({{ObjDire4[1].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjDire4[2].HeroAgainst}}</strong> - {{ObjDire4[2].WinRate}}% ({{ObjDire4[2].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjDire4[3].HeroAgainst}}</strong> - {{ObjDire4[3].WinRate}}% ({{ObjDire4[3].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjDire4[4].HeroAgainst}}</strong> - {{ObjDire4[4].WinRate}}% ({{ObjDire4[4].TotalMatch}} games)</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div class="column">

                                    <div class="card">
                                        <div class="card-content">
                                            <div class="media">
                                                <div class="media-left">
                                                    <figure class="image is-64x64">
                                                        <img :src="ObjDire5[0].Picture">
                                                    </figure>
                                                </div>
                                                <div class="media-content">
                                                    <p class="title is-4">{{ObjDire5[0].Hero}}</p>
                                                </div>
                                            </div>

                                            <div class="content">
                                                <p class="subtitle is-5">Winrate</p>
                                                <ul class="HeroNotes">
                                                    <li><strong>{{ObjDire5[0].HeroAgainst}}</strong> - {{ObjDire5[0].WinRate}}% ({{ObjDire5[0].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjDire5[1].HeroAgainst}}</strong> - {{ObjDire5[1].WinRate}}% ({{ObjDire5[1].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjDire5[2].HeroAgainst}}</strong> - {{ObjDire5[2].WinRate}}% ({{ObjDire5[2].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjDire5[3].HeroAgainst}}</strong> - {{ObjDire5[3].WinRate}}% ({{ObjDire5[3].TotalMatch}} games)</li>
                                                    <li><strong>{{ObjDire5[4].HeroAgainst}}</strong> - {{ObjDire5[4].WinRate}}% ({{ObjDire5[4].TotalMatch}} games)</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>
                </div>
                    
            </div>
        </div>
        
        <br><br>

    </div>
</template>

<script>
export default {
    middleware: ["redirectwww"],
    data() {
		return {
            isSearch: false,
            RadiantHeroSearchValue: [],
            RadiantCmbHeroes: [],
            DireHeroSearchValue: [],
            DireCmbHeroes: [],
            ObjDire1: [],
            ObjDire2: [],
            ObjDire3: [],
            ObjDire4: [],
            ObjDire5: [],
            ObjRadiant1: [],
            ObjRadiant2: [],
            ObjRadiant3: [],
            ObjRadiant4: [],
            ObjRadiant5: []
        }
    },
    async asyncData(context) {
		try {
            const [CmbHeroesRes ] = await Promise.all([
                context.$axios.get("dota2heroes/cmbheroes")
            ]);

            //Inisiasi data awal ==================== (Begin)
            let InitObjRadiant1 = [];
            let InitObjRadiant2 = [];
            let InitObjRadiant3 = [];
            let InitObjRadiant4 = [];
            let InitObjRadiant5 = [];
            let InitObjDire1 = [];
            let InitObjDire2 = [];
            let InitObjDire3 = [];
            let InitObjDire4 = [];
            let InitObjDire5 = [];

            InitObjRadiant1.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant1.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant1.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant1.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant1.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant2.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant2.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant2.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant2.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant2.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant3.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant3.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant3.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant3.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant3.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant4.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant4.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant4.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant4.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant4.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant5.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant5.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant5.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant5.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjRadiant5.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire1.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire1.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire1.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire1.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire1.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire2.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire2.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire2.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire2.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire2.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire3.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire3.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire3.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire3.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire3.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire4.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire4.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire4.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire4.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire4.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire5.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire5.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire5.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire5.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            InitObjDire5.push({"Picture": null,"Hero": "","HeroAgainst": "","WinRate": 0,"TotalMatch": 0});
            //Inisiasi data awal ==================== (End)

            return {
                RadiantCmbHeroes: CmbHeroesRes.data.DataReturn,
                DireCmbHeroes: CmbHeroesRes.data.DataReturn,
                ObjRadiant1: InitObjRadiant1,
                ObjRadiant2: InitObjRadiant2,
                ObjRadiant3: InitObjRadiant3,
                ObjRadiant4: InitObjRadiant4,
                ObjRadiant5: InitObjRadiant5,
                ObjDire1: InitObjDire1,
                ObjDire2: InitObjDire2,
                ObjDire3: InitObjDire3,
                ObjDire4: InitObjDire4,
                ObjDire5: InitObjDire5
            }
        } catch(err) {
            console.log('err :>> ', err);
        }
    },
    methods: {
        addSearchHeroRadiant (newSearch) {
            const searchHero = {
                CmbHeroName: newSearch,
                CmbHeroId: newSearch.substring(0, 2) + Math.floor((Math.random() * 10000000))
            }
            this.RadiantCmbHeroes.push(searchHero);
            this.RadiantHeroSearchValue.push(searchHero);
        },
        addSearchHeroDire (newSearch) {
            const searchHero = {
                CmbHeroName: newSearch,
                CmbHeroId: newSearch.substring(0, 2) + Math.floor((Math.random() * 10000000))
            }
            this.DireCmbHeroes.push(searchHero);
            this.DireHeroSearchValue.push(searchHero);
        },
        async AnalyzeMatch() {
            try {
                let response = await this.$axios.get("dota2heroes/analyze", {
                    params: {
                        RadiantHeroSearchValue: this.RadiantHeroSearchValue,
                        DireHeroSearchValue: this.DireHeroSearchValue
                    }
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
                    //Tampilkan
                    this.isSearch = true;
                    this.$toast.success(
                        '<img src="/images/tick.png" width="24" />&nbsp;&nbsp;<p>Data Saved</p>',
                        {
                            type: "success"
                        }
                    );

                    //Display hasil Analysis ============================= (Begin)
                    //console.log(`response.data.ReturnObj:`,response.data.ReturnObj);
                    this.ObjDire1 = response.data.ReturnObj.ObjDire1;
                    this.ObjDire2 = response.data.ReturnObj.ObjDire2;
                    this.ObjDire3 = response.data.ReturnObj.ObjDire3;
                    this.ObjDire4 = response.data.ReturnObj.ObjDire4;
                    this.ObjDire5 = response.data.ReturnObj.ObjDire5;
                    this.ObjRadiant1 = response.data.ReturnObj.ObjRadiant1;
                    this.ObjRadiant2 = response.data.ReturnObj.ObjRadiant2;
                    this.ObjRadiant3 = response.data.ReturnObj.ObjRadiant3;
                    this.ObjRadiant4 = response.data.ReturnObj.ObjRadiant4;
                    this.ObjRadiant5 = response.data.ReturnObj.ObjRadiant5;
                    //Display hasil Analysis ============================= (End)
                }

            } catch(err) {
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
.CoRed {
    color: red;
}
.CoGreen {
    color: green;
}
</style>