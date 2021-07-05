
export function addContent(content: string)
{
	if (!content?.length)
	{
		return null
	}

	return {
		value: content.replace(/\n/g, '<br/>')
	}
}
