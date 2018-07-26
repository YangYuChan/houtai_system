<template>
	<div class="wrapper">
		<v-header></v-header>
		<v-sidebar></v-sidebar>
		<div class="content">
			<router-view></router-view>
		</div>
	</div>
</template>
<script type="text/javascript">
	import vHeader from './Header.vue';
    import vSidebar from './Sidebar.vue';
    export default {
        components:{
            vHeader, vSidebar
        }
    }
</script>