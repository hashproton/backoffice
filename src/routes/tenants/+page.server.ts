import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { isApiError, tenantsClient } from "$lib/clients";

export const load: PageServerLoad = async ({ url, locals }) => {
    let page = parseInt(url.searchParams.get('page') || '1')

    if (page < 1) {
        redirect(302, '/tenants?page=1');
    }

    let filterData = {
        status: url.searchParams.get('status') || 'all',
        name: url.searchParams.get('name') || '',
    }

    const data = await tenantsClient.getTenants(page, 5, filterData);
    if (!isApiError(data)) {
        if (data.items.length === 0) {
            return {
                errors: [
                    {
                        message: 'No tenants found. Redirected to the first page.',
                    }
                ]
            }
        }
    }

    const info = await tenantsClient.getTenantsInfo();

    return {
        ...data,
        info
    };
};