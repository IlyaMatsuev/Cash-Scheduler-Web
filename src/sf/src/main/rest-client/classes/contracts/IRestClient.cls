/**
 * Created by Ilya Matsuev on 2/28/2021.
 */

public interface IRestClient {
    IRestClient toEndpoint(String endpoint);

    IRestClient withMethod(HttpMethod method);

    IRestClient withQueryParam(String name, String value);

    IRestClient withQueryParams(Map<String, String> queryParams);

    IRestClient withHeader(String name, String value);

    IRestClient withHeaders(Map<String, String> headers);

    IRestClient withBody(String body);

    RestClientResponse send();
}
