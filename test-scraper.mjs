

async function testScraper() {
    console.log('Sending request to Supabase Edge Function: sync-tools');
    try {
        const response = await fetch('https://nxzhbozkoqjyzykqppst.supabase.co/functions/v1/sync-tools', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error hitting function:', err);
    }
}

testScraper();
