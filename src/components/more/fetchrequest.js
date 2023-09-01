export const FetchRequest = {
	csrfToken: '',
	zimbraOrigin: '',
	fetch(url, options = {}) {
		const requestOptions = {
			...options,
			headers: {
				...(options && options.headers),
				...(FetchRequest.csrfToken && {
					'X-Zimbra-Csrf-Token': FetchRequest.csrfToken
				})
			},
			credentials: 'include'
		};

		return fetch(FetchRequest.zimbraOrigin + url, requestOptions).then(res => {
			return res;
		});
	}
};
