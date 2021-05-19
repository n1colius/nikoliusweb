<template>
    <section class="section">
        <div class="container">
        <h3 class="title is-2">Match Analysis Data</h3>

        <div class="columns is-desktop">
            <div class="column is-rest">

                <p>Match analysis data is compare with (732 competitive matches from 7 leagues)</p>
                <br>

                <div class="columns is-desktop">
                    <div class="column">
                        <ul class="content-listitem">
                            <li>CDA-FDC富名文贺DOTA2职业锦标赛</li>
                            <li>DPC Winter 21 League (WEU) presented by DreamLeague</li>
                            <li>DPC Winter 21 League (SEA) presented by PGL</li>
                            <li>DPC Winter 21 League (SA) presented by OGA</li>
                            <li>DPC Winter 21 League (NA) presented by BTS</li>
                            <li>DPC Winter 21 League (EEU) presented by ESL One</li>
                            <li>DPC Winter 21 League (CN) presented by Perfect World</li>
                        </ul>
                    </div>
                    <div class="column">
                        &nbsp;
                        <!--<ul class="content-listitem">
                            <li>CDA-FDC富名文贺DOTA2职业锦标赛</li>
                        </ul>-->
                    </div>
                    <div class="column">
                        &nbsp;
                        <!--<ul class="content-listitem">
                            <li>CDA-FDC富名文贺DOTA2职业锦标赛</li>
                        </ul>-->
                    </div>
                </div>

                <br>
                <nuxt-link to="/dota2/matchana" class="button is-link is-small">Back to Match Analysis</nuxt-link>
            </div>
        </div>

        </div>
    </section>
</template>

<script>
export default {
    middleware: ["redirectwww"]
}
</script>

<style scoped>
.content-listitem li {
    list-style-type: square;
    margin-left:18px;
}
</style>