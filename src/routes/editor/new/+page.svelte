<script lang="ts">
    import Tiptap from "$lib/components/Tiptap.svelte";
    interface Template {
        id: Number;
        name: string;
        description: string;
        image: string;
        fields: {
            id: Number;
            name: string;
            description: string;
            type: string;
        }[];
    }

    interface ValuatedTemplate {
        template: Template;
        valuations: {
            field_id: Number;
            value: string;
        }[];
    }

    let {data} = $props();

    let templates: Template[] = data.templates;
    let valuatedTemplates: ValuatedTemplate[] = [];
    let title = $state("");
    let firstInput = true;

</script>

<div class="flex flex-col items-center justify-center h-screen mt-[150px] bg-base-100 p-6 rounded-sm">
    <div class="w-full"><Tiptap /></div>
    <input type="text" bind:value={title} class="border-dashed border bg-transparent text-base-content w-full text-5xl text-center" placeholder="Title"/>
</div>
