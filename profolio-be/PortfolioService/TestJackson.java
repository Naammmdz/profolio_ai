import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.Builder;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data @Builder
class TestDto {
    @JsonProperty("isDefault")
    private Boolean isDefault;
}

public class TestJackson {
    public static void main(String[] args) throws Exception {
        TestDto dto = TestDto.builder().isDefault(true).build();
        ObjectMapper mapper = new ObjectMapper();
        System.out.println(mapper.writeValueAsString(dto));
    }
}
